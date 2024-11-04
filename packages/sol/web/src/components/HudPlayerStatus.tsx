/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";

import { useVoxelize } from "../hooks/useVoxelverses";

let removeTimeout: NodeJS.Timeout;
const chatVanishTime = 5000;

export function HudPlayerStatus() {
  const { itemDrops, setItemDrops } = useVoxelize();

  const chatListDomRef = useRef<HTMLUListElement>(null);
  const chatInputDomRef = useRef<HTMLInputElement>(null);

  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const hideInput = () => {
    if (!chatInputDomRef.current) return;

    chatInputDomRef.current!.value = "";
    chatInputDomRef.current!.style.visibility = "hidden";
    chatInputDomRef.current?.blur();

    setHistoryIndex(-1);
  };

  const showChatList = () => {
    clearTimeout(removeTimeout);
    chatListDomRef.current?.classList.remove("remove");
    if (chatListDomRef.current) {
      chatListDomRef.current.style.pointerEvents = "auto";
    }
  };

  const hideChatList = () => {
    clearTimeout(removeTimeout);

    removeTimeout = setTimeout(() => {
      chatListDomRef.current?.classList.add("remove");
      if (chatListDomRef.current) {
        chatListDomRef.current.style.pointerEvents = "none";
      }
    }, chatVanishTime);
  };

  useEffect(() => {
    showChatList();
    hideChatList();
  }, [itemDrops]);

  return (
    <div
      id="hud-player"
      className="fixed bottom-[20px] left-7 text-white text-sm font-bold bg-overlay pointer-events-none px-2 py-1.5 rounded flex items-center justify-center"
    >
      <ul
        className="list-none overflow-auto w-full rounded max-h-[200px] flex flex-col bg-overlay no-scrollbar"
        ref={chatListDomRef}
      >
        {itemDrops.map((item, index) => (
          <div key={index}>
            <span className="text-white">
              Got {item.itemQuantity} {item.itemName}
            </span>
          </div>
        ))}
      </ul>
    </div>
  );
}
