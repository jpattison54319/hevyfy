import AboutPage from "./skills/SkillsPage";
import HomePage from "./home/HomePage";
import SkillsPage from "./skills/SkillsPage";
import QuestsPage from "./quests/QuestsPage";
import Routines from "./Routines/Routines";
import BossArena from "./campaign/BossArena";

import { Navigate } from "react-router-dom";

export const routes = [
  {
    path: "/",
    name: "Pet",
    element: <HomePage />,
  },
  {
    path: "/skills",
    name: "Skills",
    element: <SkillsPage />,
  },
  {
    path: "/quests",
    name: "Quests",
    element: <QuestsPage />,
  },
    {
    path: "/routines",
    name: "Routines",
    element: <Routines />,
  },
  {
    path: "/BossArena",
    name: "BossArena",
    element: <BossArena />,
  },
  {
    path: "*",
    name: "NotFound",
    element: <Navigate to="/" replace />,
  }
] as const;
