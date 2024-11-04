import { useEffect, useLayoutEffect, useState } from "react";

import classNames from "classnames";
import { createPortal } from "react-dom";

import IconCoin from "../assets/voxelverses/coin-icon.png";
import IconExchange from "../assets/voxelverses/exchange-icon.png";
import IconPotion from "../assets/voxelverses/potion-icon.png";
import { useVoxelize } from "../hooks/useVoxelverses";

export function ShopPanel() {
  const { inputs, rigidControls } = useVoxelize();

  const [shouldShowMenu, setShouldShowMenu] = useState(false);

  useLayoutEffect(() => {
    if (!inputs || !rigidControls) {
      return;
    }

    inputs.bind(
      "KeyE",
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
        <h3 className="text-xl font-bold text-background-primary">Shop</h3>
        <div className="text-white w-full h-[20vh]">
          <div
            className="mt-3 w-full text-center bg-slate-100 p-4 text-black cursor-pointer hover:bg-slate-400"
            // onClick={() => exchangeItem(0, 0)}
          >
            <div>
              <div className="">
                <div className="inline-block">
                  <span className="inline-block text-3xl font-black">
                    1,000
                  </span>
                  <br />
                  <span className="inline-block text-xl">$COIN</span>
                </div>
                <img src={IconCoin} className="w-1/6 inline-block" alt="coin" />
                <img
                  src={IconExchange}
                  className="w-[50px] ml-5 mr-5 inline-block"
                  alt="exchange"
                />
                <div className="inline-block">
                  <span className="inline-block text-3xl font-black">1</span>
                  <br />
                  <span className="inline-block text-xl">ea</span>
                </div>
                <img
                  src={IconPotion}
                  className="w-1/6 inline-block"
                  alt="normal-pickaxe"
                />
              </div>
            </div>
            <div className="mt-2 text-xl">
              {/* <span>1 NORMAL PICKAXE = 100 $CUBE</span><br/> */}
              <span>
                <span className="text-green-500">BUY</span> STIMINA POTION
              </span>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
