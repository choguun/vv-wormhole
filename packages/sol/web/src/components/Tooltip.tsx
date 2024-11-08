import { useEffect, useRef } from "react";

import { useVoxelize } from "../hooks/useVoxelverses";

export function Tooltip() {
  const tooltipDomRef = useRef<HTMLParagraphElement>(null);

  const { voxelInteract, updateHooks } = useVoxelize();

  useEffect(() => {
    if (!voxelInteract || !updateHooks || !tooltipDomRef.current) {
      return;
    }

    const renderTooltipContent = () => {
      if (!voxelInteract.target) {
        tooltipDomRef.current!.innerHTML = "";
        tooltipDomRef.current!.style.visibility = "hidden";
        return;
      }

      const [vx, vy, vz] = voxelInteract.target;
      const block = voxelInteract.world.getBlockAt(vx, vy, vz);

      if (!block) {
        tooltipDomRef.current!.innerHTML = "";
        tooltipDomRef.current!.style.visibility = "hidden";
        return;
      }

      tooltipDomRef.current!.innerHTML = `${block.name} (${block.id})`;
      tooltipDomRef.current!.style.visibility = "visible";
    };

    updateHooks.push(renderTooltipContent);

    return () => {
      updateHooks.splice(updateHooks.indexOf(renderTooltipContent), 1);
    };
  }, [updateHooks, voxelInteract]);

  return (
    <p
      id="tooltip"
      className="fixed top-[50px] left-1/2 transform -translate-x-1/2 text-white text-sm font-bold pointer-events-none bg-overlay border-text-primary border-solid border-[2px] px-2 py-1.5 rounded flex items-center justify-center"
      ref={tooltipDomRef}
    ></p>
  );
}
