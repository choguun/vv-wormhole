/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";

export function HudPlayer() {
  const [stamina, setStamina] = useState(1000);

  return (
    <div
      id="hud-player"
      className="fixed top-[20px] left-7 text-white text-sm font-bold bg-overlay pointer-events-none px-2 py-1.5 rounded flex items-center justify-center"
    >
      {/* <h2>HP: 100/100</h2>
      <br /> */}
      <h2>Stamina: {stamina.toLocaleString()}/1,000</h2>
    </div>
  );
}
