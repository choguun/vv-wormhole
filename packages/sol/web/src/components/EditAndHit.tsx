/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";

import { useComponentValue } from "@latticexyz/react";
import { Entity } from "@latticexyz/recs";
import { encodeSystemCallFrom } from "@latticexyz/world/internal";
import { type BlockUpdate, type Coords3 } from "@vv-libs/core";
import { toast } from "react-hot-toast";
import { Raycaster, Vector2, Vector3 } from "three";

import BlockSound from "../assets/sounds/game/block.ogg";
import { editableWorlds, grayReplacement } from "../constants";
import { useAudio } from "../hooks/useAudio";
import { useVoxelize } from "../hooks/useVoxelverses";
import { isAdmin } from "../utils/isAdmin";

export function EditingAndHitting() {

  const [stamina, setStamina] = useState(0);

  const handleMine = async (voxelData: any) => {
    const type = [];
    try {
      toast.loading("Mine...");
      toast.success("Mine");

      // TODO: how to know what item to on-chain drop?
      // TODO: need to figure out this part.
      setItemDrops((prev) => [
        ...prev,
        {
          itemName: "Coin",
          itemQuantity: 100,
        },
      ]);
    } catch (e) {
      toast.error(e.message);
      console.error(e);
    }
  };

  const {
    worldName,
    voxelInteract,
    debug,
    inputs,
    world,
    itemSlots,
    rigidControls,
    updateHooks,
    setChatItems,
    setItemDrops,
    blockEntities,
    peers,
    camera,
    method,
  } = useVoxelize();

  const { playAudio } = useAudio();

  useEffect(() => {
    if (!world || !updateHooks) {
      return;
    }

    const updatePositions: Coords3[] = [];

    world.addBlockUpdateListener(({ voxel }) => {
      updatePositions.push(voxel);
    });

    updateHooks.push(() => {
      const limit = updatePositions.length > 3 ? 1 : updatePositions.length;
      for (let i = 0; i < limit; i++) {
        const [vx, vy, vz] = updatePositions[i];
        playAudio(BlockSound, 2, new Vector3(vx, vy, vz));
      }
      updatePositions.length = 0;
    });

    // eslint-disable-next-line
  }, [world]);

  useEffect(() => {
    if (
      !voxelInteract ||
      !inputs ||
      !world ||
      !debug ||
      !itemSlots ||
      !rigidControls ||
      !blockEntities ||
      !peers ||
      !camera ||
      !method
    ) {
      return;
    }

    const isUserAdmin = isAdmin();

    const radius = 1;
    const circular = true;
    const ADMINIUM_ID = 10000;

    const canRegularUserPlaceBreak = editableWorlds.includes(worldName);

    const sendNoBreakMessage = () => {
      setChatItems((prev) => [
        ...prev,
        {
          type: "chat",
          sender: "[SYSTEM]",
          body: `$${grayReplacement}$Spawn protection!`,
        },
      ]);
    };

    const getAdminCheck = (target: Coords3) => {
      const [vx, vy, vz] = target;

      const id = world.getVoxelAt(vx, vy, vz);
      if (!isUserAdmin && id === ADMINIUM_ID) {
        sendNoBreakMessage();
        return false;
      }

      if (worldName === "terrain" && !isUserAdmin) {
        console.log("vx, vz: ", vx, vz);
        const distFromOrigin = Math.sqrt(vx ** 2 + vz ** 2);
        // console.log("distFromOrigin: ", distFromOrigin);
        if (distFromOrigin <= 5) {
          sendNoBreakMessage();
          return false;
        }
      }

      return true;
    };

    const bulkDestroy = () => {
      if (!voxelInteract.target) return;
      if (!isUserAdmin && !canRegularUserPlaceBreak) return;

      const [vx, vy, vz] = voxelInteract.target;

      if (!getAdminCheck([vx, vy, vz])) {
        return;
      }

      const updates: BlockUpdate[] = [];

      for (let x = -radius; x <= radius; x++) {
        for (let y = -radius; y <= radius; y++) {
          for (let z = -radius; z <= radius; z++) {
            if (circular && x ** 2 + y ** 2 + z ** 2 > radius ** 2 - 1)
              continue;

            const currentId = world.getVoxelAt(vx + x, vy + y, vz + z);

            if (currentId !== 0) {
              updates.push({
                vx: vx + x,
                vy: vy + y,
                vz: vz + z,
                type: 0,
              });
            }
          }
        }
      }

      if (updates.length) {
        const result = world.updateVoxels(updates);
        handleMine(result);
      }
    };

    const bulkPlace = () => {
      if (!voxelInteract.potential) return;
      if (!isUserAdmin && !canRegularUserPlaceBreak) return;

      const {
        voxel: [vx, vy, vz],
        rotation,
        yRotation,
        yRotation4,
        yRotation8,
      } = voxelInteract.potential;

      if (!getAdminCheck([vx, vy, vz])) {
        return;
      }

      const updates: BlockUpdate[] = [];
      const block = world.getBlockById(itemSlots.getFocused().content);

      // ban water
      if (block.id === 30000 && !isUserAdmin) {
        return;
      }

      for (let x = -radius; x <= radius; x++) {
        for (let y = -radius; y <= radius; y++) {
          for (let z = -radius; z <= radius; z++) {
            if (circular && x ** 2 + y ** 2 + z ** 2 > radius ** 2 - 1)
              continue;

            updates.push({
              vx: vx + x,
              vy: vy + y,
              vz: vz + z,
              type: block.id,
              rotation: block.rotatable ? rotation : 0,
              yRotation:
                block.yRotatableSegments === "Four"
                  ? yRotation4
                  : block.yRotatableSegments === "Eight"
                  ? yRotation8
                  : yRotation,
            });
          }
        }
      }

      if (updates.length) world.updateVoxels(updates);
    };

    const maxCols = itemSlots.options.horizontalCount;

    inputs.scroll(
      () => {
        itemSlots.setFocused(0, (itemSlots.focusedCol + 1) % maxCols);
      },
      () => {
        itemSlots.setFocused(0, (itemSlots.focusedCol - 1 + maxCols) % maxCols);
      },
      "in-game"
    );

    if (isUserAdmin) {
      // inputs.scroll(
      //   () => (radius = Math.min(maxRadius, radius + 1)),
      //   () => (radius = Math.max(minRadius, radius - 1)),
      //   'menu',
      // );
    }

    const blocksToSkip = [
      "Youtube",
      "Github",
      "LinkedIn",
      "Twitter",
      "Mail",
      "BuyMeACoffee",
      "Trophy (mc.js)",
      "Trophy (voxelize)",
      "Trophy (modern-graphql-tutorial)",
      "Trophy (mine.js)",
      "Trophy (rust-typescript-template)",
      "Trophy (mc.js-legacy)",
    ];

    inputs.click("right", () => {
      if (!voxelInteract.potential) return;

      const {
        voxel: [vx, vy, vz],
      } = voxelInteract.potential;

      // Check if target block has an action
      if (voxelInteract.target) {
        const [tvx, tvy, tvz] = voxelInteract.target || [0, 0, 0];
        const block = world.getBlockAt(tvx, tvy, tvz);
        if (blocksToSkip.includes(block?.name || "")) return;

        // handle entity right click
        if (block.isEntity) {
          blockEntities.handleRightClickAt(tvx, tvy, tvz);
          return;
        }
      }

      const slot = itemSlots.getFocused();
      const id = slot.content;
      if (!id) return;

      const { aabbs } = world.getBlockById(id);
      if (
        aabbs.find((aabb) =>
          aabb
            .clone()
            .translate([vx, vy, vz])
            .intersects(rigidControls.body.aabb)
        )
      )
        return;

      bulkPlace();
    });

    const raycaster = new Raycaster();

    inputs.click(
      "left",
      () => {
        const allPeerMeshes = peers.children;

        // raycast from camera to mouse position
        raycaster.setFromCamera(new Vector2(), camera);

        // TODO: right now set makes the order ambiguous

        const intersects = raycaster.intersectObjects(allPeerMeshes);
        // for each intersect, go up parent chain until we hit the but not the world / peers
        const intersected = Array.from(
          new Set(
            intersects.map((intersect) => {
              let obj = intersect.object;
              while (
                obj.parent &&
                obj.parent !== world &&
                obj.parent !== peers
              ) {
                obj = obj.parent;
              }
              return {
                object: obj,
                position: intersect.point,
              };
            })
          )
        );
        const [targetPeer] = intersected;

        if (targetPeer && targetPeer.object.userData.id) {
          const hitDirection = new Vector3()
            .subVectors(
              targetPeer.position,
              camera.getWorldPosition(new Vector3())
            )
            .normalize();
          const hitImpulseMagnitude = 15.2; // Use a clear variable for the impulse magnitude
          const hitImpulse = hitDirection.multiplyScalar(hitImpulseMagnitude);
          hitImpulse.y *= 0.6;
          hitImpulse.y = Math.abs(hitImpulse.y);

          method.call("hit-player", {
            id: targetPeer.object.userData.id,
            impulse: hitImpulse.toArray(),
          });
          return;
        }

        const { target } = voxelInteract;
        if (!target) return;
        if (100 >= 10) bulkDestroy();
        else {
          alert("Stamina is not enough!");
        }
      },
      "in-game"
    );

    debug.registerDisplay("Edit radius", () => radius);

    // eslint-disable-next-line
  }, [
    debug,
    inputs,
    itemSlots,
    rigidControls,
    voxelInteract,
    world,
    worldName,
  ]);

  return null;
}
