/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */


import { AIVoxelizer } from "../components/AIVoxelizer";
import { EditingAndHitting } from "../components/EditAndHit";
import { HUDMenu } from "../components/HudMenu";
import { Inventory } from "../components/Inventory";
import { Main } from "../components/Main";
import { TabList } from "../components/TabList";
import { Tooltip } from "../components/Tooltip";
import { currentWorldName } from "../constants";
import { AudioProvider } from "../containers/Providers/Audio";
import { VoxelizeProvider } from "../containers/Providers/Voxelverses";

import { Menu } from "../components/Menu";
import { GameMenu } from "../components/GameMenu";
import { HudPlayer } from "../components/HudPlayer";
import { HudPlayerStatus } from "../components/HudPlayerStatus";
import { NPCPanel } from "../components/NPCPanel";
import { QuestPanel } from "../components/QuestPanel";
import { ShopPanel } from "../components/ShopPanel";

export const WorldRoot = () => {
  return (
    <>
      <Main />
      <VoxelizeProvider worldName={currentWorldName} canvasId="main">
        <AudioProvider>
          <Tooltip />
          <Inventory />
          <HUDMenu />
          <HudPlayer />
          <HudPlayerStatus />
          <Menu />
          <GameMenu />
          <NPCPanel />
          <QuestPanel />
          <ShopPanel />
          <AIVoxelizer />
          <EditingAndHitting />
          <TabList />
        </AudioProvider>
      </VoxelizeProvider>
    </>
  );
};
