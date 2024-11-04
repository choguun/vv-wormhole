/* eslint-disable @typescript-eslint/no-unused-vars */

import IconExchange from "../assets/images/icon/exchange.png";
import IconInventory from "../assets/images/icon/inventory.png";
import IconMenu from "../assets/images/icon/menu.png";
import IconQuest from "../assets/images/icon/quest.png";

export function HUDMenu() {
  return (
    <div
      id="hud-menu"
      className="fixed top-[10px] right-10 transform -translate-x-1/5 text-white text-sm font-bold pointer-events-none bg-overlay border-text-primary border-solid border-[2px] px-2 py-1.5 rounded flex items-center justify-center"
    >
      <div className="ml-2 cursor-pointer text-center">
        <img src={IconInventory} alt="inventory" className="w-[50px]" />
        <br />
        <span className="text-md">Inventory</span>
        <br />
        <span className="text-sm">Press I</span>
      </div>
      <div className="ml-2 cursor-pointer text-center">
        <img src={IconExchange} alt="inventory" className="w-[50px]" />
        <br />
        <span className="text-md">Shop</span>
        <br />
        <span className="text-sm">Press E</span>
      </div>
      <div className="ml-4 mr-2 cursor-pointer text-center">
        <img src={IconQuest} alt="menu" className="w-[50px]" />
        <br />
        <span className="text-md">Quests</span>
        <br />
        <span className="text-sm">Press Q</span>
      </div>
      <div className="ml-4 mr-2 cursor-pointer text-center">
        <img src={IconMenu} alt="menu" className="w-[50px]" />
        <br />
        <span className="text-md">Menu</span>
        <br />
        <span className="text-sm">Press M</span>
      </div>
    </div>
  );
}
