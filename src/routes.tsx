import AboutPage from "./skills/SkillsPage";
import HomePage from "./home/HomePage";
import SkillsPage from "./skills/SkillsPage";
import QuestsPage from "./quests/QuestsPage";

export const routes = [
  {
    path: "/",
    name: "Character",
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
] as const;
