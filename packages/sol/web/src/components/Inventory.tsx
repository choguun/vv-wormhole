/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";

import { useComponentValue } from "@latticexyz/react";
import { Entity } from "@latticexyz/recs";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { ItemSlots } from "@vv-libs/core";
import classNames from "classnames";
import { createPortal } from "react-dom";
import { Tooltip } from "react-tooltip";
import { Group } from "three";

import IconArtifact from "../assets/images/icon/artifact-icon.png";
import IconCommon from "../assets/images/icon/common-icon.png";
import IconGod from "../assets/images/icon/god-icon.png";
import IconRare from "../assets/images/icon/rare-icon.png";
import IconCommonBox from "../assets/voxelverses/common-box-icon.png";
import IconEliteBox from "../assets/voxelverses/elite-box-icon.png";
import IconEpicBox from "../assets/voxelverses/epic-box-icon.png";
import IconGoldCoin from "../assets/voxelverses/gold-coin.svg";
import IconLegendaryBox from "../assets/voxelverses/legendary-box-icon.png";
import IconMythicBox from "../assets/voxelverses/mythic-box-icon.png";
import IconMetalPickAxe from "../assets/voxelverses/pickaxe-metal.png";
import IconNormalPickAxe from "../assets/voxelverses/pickaxe-normal.png";
import { characterModels } from "../constants";
import { usePersistentState } from "../hooks/usePersistentState";
import { useVoxelize } from "../hooks/useVoxelverses";
import { isAdmin } from "../utils/isAdmin";

interface ModelProps {
  url: string;
}

const Model: React.FC<ModelProps> = ({ url }) => {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(url);
  const [positionOffset, setPositionOffset] = useState(0);

  useFrame((state, delta) => {
    if (group.current) {
      // Update the position offset to create a smooth back-and-forth motion
      setPositionOffset((prevOffset) => {
        const newOffset = prevOffset + delta * 0.5; // Adjust the speed of the motion
        return newOffset % (Math.PI * 2); // Loop the motion
      });

      // Apply the position offset to the model's position
      group.current.position.y = -3 + Math.sin(positionOffset) * 0.1; // Adjust the amplitude of the motion
    }
  });

  scene.rotation.y = Math.PI; // Rotate 180 degrees around the y-axis
  scene.position.y = -15; // Lower the model by 1 unit
  scene.scale.set(12, 12, 12); // Increase the size by a factor of 2

  return <primitive object={scene} ref={group} />;
};

export function Inventory() {
  const wrapperDomRef = useRef<HTMLDivElement>(null);

  const { itemSlots, world, inputs, voxelInteract, rigidControls } =
    useVoxelize();
  const [itemSlotIds, setItemSlotIds] = usePersistentState(
    "voxelverses-inventory",
    []
  );

  const character = localStorage.getItem("vv-character-id");

  const inventorySlotsRef = useRef<ItemSlots>(null);
  const [shouldShowInventory, setShouldShowInventory] = useState(false);

  useEffect(() => {
    if (!inputs || !rigidControls) {
      return;
    }

    const unbind = inputs.bind(
      "KeyI",
      () => {
        setShouldShowInventory((prev) => !prev);
        rigidControls.unlock();
        rigidControls.resetMovements();
      },
      "in-game",
      {
        checkType: "code",
      }
    );

    return () => {
      unbind();
    };
  }, [inputs, rigidControls]);

  useEffect(() => {
    if (!shouldShowInventory || !rigidControls) {
      return;
    }

    const handleCloseInventory = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();

        setShouldShowInventory(false);
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
  }, [rigidControls, shouldShowInventory]);

  useEffect(() => {
    if (
      inventorySlotsRef.current ||
      !world ||
      !itemSlots ||
      !inputs ||
      !wrapperDomRef.current
    ) {
      return;
    }

    const sortedBlocks = [...Array.from(world.registry.blocksByName)]
      .sort((a, b) => a[1].id - b[1].id)
      .filter(
        ([name, block]) =>
          name !== "air" &&
          (isAdmin()
            ? true
            : name.toLowerCase() !== "adminium" &&
              !block.isEntity &&
              // ban water
              block.id !== 30000)
      );

    const colCount = 8; // itemSlots.options.horizontalCount;
    const rowCount = 3; // Math.ceil(sortedBlocks.length / colCount);

    const inventorySlots = new ItemSlots({
      verticalCount: rowCount,
      horizontalCount: colCount,
      slotMargin: 0,
      slotHoverClass: "inventory-hover",
      slotFocusClass: "inventory-focus",
      wrapperStyles: {
        position: "relative",
        margin: "0px",
      },
      slotStyles: {
        border: "1px solid var(--color-gray-background-light)",
        transition: "none",
      },
      scrollable: false,
    });

    // @ts-ignore
    inventorySlotsRef.current = inventorySlots;
    inventorySlots.connect(inputs);

    const inventorySlotsDom = inventorySlots.element;
    wrapperDomRef.current.appendChild(inventorySlotsDom);

    // for (let i = 0; i < sortedBlocks.length; i++) {
    //   const id = sortedBlocks[i][1].id;
    //   const mesh = world.makeBlockMesh(id, { material: "standard" });
    //   const slot = inventorySlots.getSlot(
    //     Math.floor(i / colCount),
    //     i % colCount
    //   );
    //   slot.setObject(mesh);
    //   slot.setContent(id);
    // }
  }, [inventorySlotsRef, world, itemSlots, inputs]);

  useEffect(() => {
    if (!inventorySlotsRef.current || !itemSlots) {
      return;
    }

    inventorySlotsRef.current.onSlotClick = (slot) => {
      if (!slot.content) return;
      setItemSlotIds((prev) => {
        const newIds = [...prev];
        newIds[itemSlots.focusedCol] = slot.content;
        return newIds;
      });
    };
  }, [inventorySlotsRef, itemSlots, setItemSlotIds]);

  useEffect(() => {
    if (!inputs || !world || !voxelInteract || !itemSlots || !rigidControls) {
      return;
    }

    const unbind = inputs.click(
      "middle",
      () => {
        if (!voxelInteract.target) return;
        const [vx, vy, vz] = voxelInteract.target;
        const block = world.getBlockAt(vx, vy, vz);
        if (!block) return;
        const id = block.id;
        const { focusedCol } = itemSlots;
        setItemSlotIds((prev) => {
          const newIds = [...prev];
          newIds[focusedCol] = id;
          return newIds;
        });
      },
      "in-game"
    );

    return () => {
      unbind();
    };
  }, [inputs, itemSlots, voxelInteract, world, itemSlotIds, rigidControls]);

  useEffect(() => {
    if (!world || !itemSlots) {
      return;
    }

    itemSlotIds.forEach((id, index) => {
      const mesh = world.makeBlockMesh(id, { material: "standard" });
      const slot = itemSlots.getSlot(0, index);
      slot.setObject(mesh);
      slot.setContent(id);
    });
  }, [itemSlotIds, itemSlots, world]);

  // useEffect(() => {
  //   fetchInventory();
  //   // console.log(inventory);
  // }, [shouldShowInventory]);

  return createPortal(
    <>
      <div
        className={classNames(
          "fixed bottom-0 left-0 w-full h-full bg-black opacity-50",
          { hidden: !shouldShowInventory }
        )}
        onClick={() => {
          setShouldShowInventory(false);
          rigidControls?.lock();
        }}
      />
      <div
        className={classNames(
          "top-1/3 mt-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-[80vh] bg-overlay rounded fixed cursor-pointer align-middle text-sm py-3 px-3 border border-solid border-border flex flex-col items-center justify-center",
          { hidden: !shouldShowInventory }
        )}
      >
        <div className="mb-8 w-full text-center">
          <span className="text-xl text-background-primary font-bold inline-block ml-20">
            Inventory
          </span>
          <div
            className="h-[30px] w-[100px] inline-block float-right right-1"
            style={{
              transition: "none",
            }}
          >
            <img
              src={IconGoldCoin}
              className="h-[90%] inline-block"
              alt="gold-coin"
            />
            <span className="font-black text-white inline-block">
              x 0
            </span>
          </div>
        </div>
        <div className="text-white w-full grid grid-cols-3 gap-4 mb-2">
          <div className="h-[80px] w-full flex flex-col items-center justify-center">
            <span>Main Equipment</span>
            <div
              className="w-[60px] h-[60px] rounded-md"
              style={{
                border: "1px solid var(--color-gray-background-light)",
                transition: "none",
              }}
            ></div>
          </div>
          <div
            className="h-[150px] w-full flex items-center justify-center"
            style={{
              border: "1px solid var(--color-gray-background-light)",
              transition: "none",
            }}
          >
            <Canvas>
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <Model url={characterModels[character]} />
              <OrbitControls
                enableRotate={true}
                enableZoom={false}
                enablePan={true}
              />
            </Canvas>
          </div>
          <div className="h-[80px] w-full flex flex-col items-center justify-center">
            <span>Second Equipment</span>
            <div
              className="w-[60px] h-[60px] rounded-md"
              style={{
                border: "1px solid var(--color-gray-background-light)",
                transition: "none",
              }}
            ></div>
          </div>
        </div>
        <div className="mb-2 text-white">
          <div
            className="w-[50px] h-[50px] rounded-md inline-block -ml-1"
            style={{
              border: "1px solid var(--color-gray-background-light)",
              transition: "none",
            }}
          >
            <a data-tooltip-id="my-tooltip1" data-tooltip-html="COMMON">
              <img
                src={IconCommonBox}
                className="h-[45px] mx-auto"
                alt="common"
              />
            </a>
            <Tooltip id="my-tooltip1" />
            <span className="font-black">x 0</span>
          </div>
          <div
            className="w-[50px] h-[50px] rounded-md inline-block ml-1"
            style={{
              border: "1px solid var(--color-gray-background-light)",
              transition: "none",
            }}
          >
            <a data-tooltip-id="my-tooltip2" data-tooltip-html="ELITE">
              <img
                src={IconEliteBox}
                className="h-[45px] mx-auto"
                alt="Elite Box"
              />
            </a>
            <Tooltip id="my-tooltip2" />
            <span className="font-black">x 0</span>
          </div>
          <div
            className="w-[50px] h-[50px] rounded-md inline-block ml-1"
            style={{
              border: "1px solid var(--color-gray-background-light)",
              transition: "none",
            }}
          >
            <a data-tooltip-id="my-tooltip3" data-tooltip-html="EPIC">
              <img
                src={IconEpicBox}
                className="h-[45px] mx-auto"
                alt="Epic Box"
              />
            </a>
            <Tooltip id="my-tooltip3" />
            <span className="font-black">x 0</span>
          </div>
          <div
            className="w-[50px] h-[50px] rounded-md inline-block ml-1"
            style={{
              border: "1px solid var(--color-gray-background-light)",
              transition: "none",
            }}
          >
            <a data-tooltip-id="my-tooltip4" data-tooltip-html="Legendary">
              <img
                src={IconLegendaryBox}
                className="h-[45px] mx-auto"
                alt="Legendary Box"
              />
            </a>
            <Tooltip id="my-tooltip4" />
            <span className="font-black">x 0</span>
          </div>
          <div
            className="w-[50px] h-[50px] rounded-md inline-block ml-1"
            style={{
              border: "1px solid var(--color-gray-background-light)",
              transition: "none",
            }}
          >
            <a data-tooltip-id="my-tooltip5" data-tooltip-html="Mythic">
              <img
                src={IconMythicBox}
                className="h-[45px] mx-auto"
                alt="Mythic Box"
              />
            </a>
            <Tooltip id="my-tooltip5" />
            <span className="font-black">x 0</span>
          </div>
          <div
            className="w-[50px] h-[50px] rounded-md inline-block ml-1 mb-2"
            style={{
              border: "1px solid var(--color-gray-background-light)",
              transition: "none",
            }}
          ></div>
          <div
            className="w-[50px] h-[50px] rounded-md inline-block ml-1 mb-2"
            style={{
              border: "1px solid var(--color-gray-background-light)",
              transition: "none",
            }}
          ></div>
          <div
            className="w-[50px] h-[50px] rounded-md inline-block ml-1 mb-2"
            style={{
              border: "1px solid var(--color-gray-background-light)",
              transition: "none",
            }}
          ></div>
        </div>
        <div ref={wrapperDomRef} className="no-scrollbar overflow-auto"></div>
      </div>
    </>,
    document.body
  );
}
