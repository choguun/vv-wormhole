import { useState, useLayoutEffect } from "react";

// import { ConnectButton, useAccount } from "@particle-network/connectkit";
// import { ConnectButton } from "@rainbow-me/rainbowkit";

import { useVoxelize } from "../hooks/useVoxelverses";

export function Menu() {
  const { inputs, rigidControls } = useVoxelize();

  const [shouldShowMenu, setShouldShowMenu] = useState(true);

  useLayoutEffect(() => {
    if (!inputs || !rigidControls) {
      return;
    }

    // inputs.bind(
    //   "KeyM",
    //   () => {
    //     setShouldShowMenu((prev) => !prev);
    //     rigidControls.unlock();
    //     rigidControls.resetMovements();
    //   },
    //   "in-game",
    //   {
    //     checkType: "code",
    //   }
    // );
  }, [inputs, rigidControls]);

  return shouldShowMenu ? (
    <div className="fixed inset-0 bg-overlay flex items-center justify-center">
      <div className="bg-text-primary text-background-primary px-4 py-3.5 rounded border border-solid border-border min-w-[300px] flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-6xl bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-violet-500 text-transparent bg-clip-text">
            Voxelverses Game
          </h1>
          <p className="text-gray-background-dark float-right">v0.9.0</p>
          <h2>
            -WASD to move
            <br />
            -Space to jump
            <br />
            -T to chat
            <br />
            -I for inventory
            <br />
            -Q for quest
            <br />
            -1 - 8 for hotbar slots
            <br />
            {/* -C to change camera view<br/> */}
            -Left mouse click: destroy block
            <br />
            -Right mouse put block
          </h2>
        </div>
          <button
            className="border-none bg-background-tertiary text-text-primary py-2 rounded text-base hover:bg-background-secondary flex items-center justify-center align-middle cursor-pointer"
            onClick={() => {
              setShouldShowMenu(false);
              rigidControls?.lock();
            }}
          >
            PLAY
          </button>
      </div>
    </div>
  ) : (
    <></>
  );
}
