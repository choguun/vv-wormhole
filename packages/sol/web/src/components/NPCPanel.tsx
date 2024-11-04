import { useEffect, useLayoutEffect, useState } from "react";

import axios from "axios";
import classNames from "classnames";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

import { useVoxelize } from "../hooks/useVoxelverses";

export function NPCPanel() {
  const { inputs, rigidControls } = useVoxelize();

  const [shouldShowMenu, setShouldShowMenu] = useState(false);
  const [ask, setAsk] = useState("");
  const [conversation, setConversation] = useState([
    { role: "NPC", content: "Hello, I am AI NPC." },
  ]);

  const talkToNpc = async () => {
    const loading1 = toast.loading("waiting...");
    try {
      const response = await axios.post(
        "https://llm2.voxelverses.xyz/api/v1/chat",
        {
          user_id: "user123",
          session_id: "session123",
          chat_data: {
            messages: [{ role: "user", content: `${ask}` }],
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const npcResponse = response.data;
      setConversation((prev) => [
        ...prev,
        { role: "user", content: ask },
        { role: "NPC", content: npcResponse },
      ]);
      setAsk("");
    } catch (error: any) {
      console.error(error);
      toast.error("Quest error: ", error);
    } finally {
      toast.dismiss(loading1);
    }
  };

  useLayoutEffect(() => {
    if (!inputs || !rigidControls) {
      return;
    }

    inputs.bind(
      "KeyN",
      () => {
        setShouldShowMenu((prev) => !prev);
        // console.log(rigidControls);
        rigidControls.unlock();
        rigidControls.resetMovements();
      },
      "in-game",
      {
        checkType: "code",
      }
    );
  }, [inputs, rigidControls]);

  useEffect(() => {
    if (!shouldShowMenu || !rigidControls) {
      return;
    }

    const handleCloseInventory = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();

        setShouldShowMenu(false);
        rigidControls.lock();
      }
    };

    const preventEscapeDefault = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("keydown", preventEscapeDefault);
    document.addEventListener("keyup", handleCloseInventory);

    return () => {
      document.removeEventListener("keydown", preventEscapeDefault);
      document.removeEventListener("keyup", handleCloseInventory);
    };
  }, [rigidControls, shouldShowMenu]);

  return createPortal(
    <>
      <div
        className={classNames(
          "fixed bottom-0 left-0 w-full h-full bg-black opacity-50",
          { hidden: !shouldShowMenu }
        )}
        onClick={() => {
          setShouldShowMenu(false);
          rigidControls?.lock();
        }}
      />
      <div
        className={classNames(
          "top-1/3 mt-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-[50vh] w-1/3 bg-overlay rounded fixed cursor-pointer align-middle text-sm py-3 px-3 border border-solid border-border gap-2 flex flex-col items-center",
          { hidden: !shouldShowMenu }
        )}
      >
        <h3 className="text-base text-background-primary">NPC</h3>
        <div className="text-white w-full h-[70vh]">
          <textarea
            className="w-full h-[20vh] bg-slate-100 p-4 text-black"
            value={conversation
              .map((msg) => `${msg.role}: ${msg.content}`)
              .join("\n")}
            readOnly
          ></textarea>
          <div className="mt-3 w-full text-center bg-slate-100 p-4 text-black hover:bg-slate-400">
            <input
              placeholder="talk with NPC..."
              value={ask}
              onChange={(e) => {
                setAsk(e.target.value);
              }}
              className="border-1 border-black w-full p-2"
            ></input>
          </div>
          <button
            className="mt-3 w-full bg-slate-100 p-4 text-black hover:bg-slate-400 cursor-pointer"
            onClick={() => talkToNpc()}
          >
            Submit
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
