import { useEffect, useLayoutEffect, useState } from "react";

import classNames from "classnames";
import { createPortal } from "react-dom";

import { QuestModal } from "../amalgema-ui/QuestModal";
import { useVoxelize } from "../hooks/useVoxelverses";

export function QuestPanel() {
  const { inputs, rigidControls } = useVoxelize();

  const [shouldShowMenu, setShouldShowMenu] = useState(false);

  useLayoutEffect(() => {
    if (!inputs || !rigidControls) {
      return;
    }

    inputs.bind(
      "KeyQ",
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
      >
        <div
          className={classNames(
            "top-1/3 mt-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-[50vh] w-1/3 bg-overlay rounded fixed cursor-pointer align-middle text-sm py-3 px-3 border border-solid border-border gap-2 flex flex-col items-center",
            { hidden: !shouldShowMenu }
          )}
        >
          {/* <h3 className="text-base text-background-primary">Quest</h3>
          <div className="text-white w-full h-[40vh]"></div> */}
          <QuestModal setOpen={setShouldShowMenu} isOpen={shouldShowMenu} />
        </div>
      </div>
    </>,
    document.body
  );
}
