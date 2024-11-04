import { useState, useLayoutEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useVoxelize } from "../hooks/useVoxelverses";

export function GameMenu() {
  const { inputs, rigidControls } = useVoxelize();
  const navigate = useNavigate();

  const [shouldShowMenu, setShouldShowMenu] = useState(false);

  useLayoutEffect(() => {
    if (!inputs || !rigidControls) {
      return;
    }

    inputs.bind(
      "KeyM",
      () => {
        setShouldShowMenu((prev) => !prev);
        rigidControls.unlock();
        rigidControls.resetMovements();
      },
      "in-game",
      {
        checkType: "code",
      }
    );
  }, [inputs, rigidControls]);

  return shouldShowMenu ? (
    <div className="fixed inset-0 bg-overlay flex items-center justify-center">
      <div className="bg-text-primary text-background-primary px-4 py-3.5 rounded border border-solid border-border min-w-[300px] w-[500px] flex flex-col gap-2 -mt-10">
        <div className="flex flex-col gap-1">
          <h1 className="text-center">MENU</h1>
          <button className="p-4 w-full bg-amber-200 text-black font-bold text-xl cursor-pointer">
            SETTINGS
          </button>
          <button
            onClick={() => navigate("/lobby")}
            className="p-4 w-full bg-amber-200 text-black font-bold text-xl cursor-pointer mt-3"
          >
            LOBBY
          </button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}
