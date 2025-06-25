import AboutPage from "./about/AboutPage";
import HomePage from "./home/HomePage";

export const routes = [
  {
    path: "/",
    name: "Character",
    element: <HomePage />,
  },
  {
    path: "/about",
    name: "Skills",
    element: <AboutPage />,
  },
  {
    path: "/quests",
    name: "Quests",
    element: <AboutPage />,
  },
] as const;
