import {
  Badge,
   Drawer, DrawerCloseButton, FlexItem, FlexLayout,
  GridItem,
  GridLayout, Menu, MenuItem, MenuPanel, MenuTrigger,
  NavigationItem,
  NavigationItemProps,
  StackLayout,
  Text, Tooltip,
} from "@salt-ds/core";
import {AddIcon, CallIcon, MenuIcon, NotificationIcon, UserIcon} from "@salt-ds/icons";
import { ForwardedRef, forwardRef, useState } from "react";
import {
  To,
  useHref,
  useLinkClickHandler,
  useLocation,
  useNavigate,
} from "react-router-dom";
import jpmLogo from "../assets/JPM_logo_2008_DIGITAL_D_Black.png";
import { routes } from "../routes";

import "./Header.css";
import { handleSignOut } from "../SignOut";
import LogFoodPage from "../LogFoodPage/LogFoodPage";
import { WorkoutLogger } from "../WorkoutLoggerPage/WorkoutLogger";
import ViewMeals from "../ViewMeals/ViewMeals";
import LogWeight from "../LogWeight/LogWeight";
import ViewWorkouts from "../ViewWorkouts/ViewWorkouts";
import { Button, Tab, TabGroup, TabList } from "@headlessui/react";
import Settings from "../Settings/Settings";
import {PawPrint, Star, BookOpen, Flag, Dumbbell} from "lucide-react";

// Modified from https://reactrouter.com/en/6.18.0/hooks/use-link-click-handler
const NavLink = forwardRef(function NavLink(
  { onClick, to, ...rest }: Omit<NavigationItemProps, "parent"> & { to: To },
  ref: ForwardedRef<HTMLDivElement>
) {
  const href = useHref(to);
  const handleClick = useLinkClickHandler(to);

  return (
    <NavigationItem
      {...rest}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          // @ts-expect-error NavigationItem event is anchor when not as parent
          handleClick(event);
        }
      }}
      ref={ref}
    />
  );
});
const TABS = [
  { id: "pet", icon: PawPrint, label: "Pet", path: "/" },
  { id: "skills", icon: Star, label: "Skills", path: "/skills" },
  { id: "quests", icon: BookOpen, label: "Quests", path: "/quests" },
  { id: "campaign", icon: Flag, label: "Campaign", path: "/BossArena" },
  { id: "routines", icon: Dumbbell, label: "Routines", path: "/routines" },];

type DrawerTypes = "none" | "logFood" | "logWorkout" | "workoutHist" | "mealHist" | "logWeight" | "settings";
// Check App header pattern: https://www.saltdesignsystem.com/salt/patterns/app-header
const Header = () => {
  const [drawerView, setDrawerView] = useState<DrawerTypes>("none");

  const { pathname } = useLocation();
const navigate = useNavigate();

// Match current pathname to tab
const selectedIndex = TABS.findIndex(tab => tab.path === pathname);

// Default to 0 if no match (e.g., fallback route)
const safeSelectedIndex = selectedIndex >= 0 ? selectedIndex : 0;

 return (
  <div className="app-header">
  {/* Left section - Menu button */}
  <div>
    <Menu>
      <MenuTrigger>
        <Button className="saltButton" aria-label="Open Menu">
          <AddIcon aria-hidden />
        </Button>
      </MenuTrigger>
      <MenuPanel>
        <MenuItem onClick={() => setDrawerView("logWeight")}>Log Weight</MenuItem>
        <MenuItem onClick={() => setDrawerView("logFood")}>Log Food</MenuItem>
        <MenuItem onClick={() => setDrawerView("logWorkout")}>Log Workout</MenuItem>
      </MenuPanel>
    </Menu>
  </div>

  {/* Center section - Tabs */}
  <TabGroup selectedIndex={safeSelectedIndex}  onChange={(index) => navigate(TABS[index].path)}>
  <TabList className="tab-nav">
    {TABS.map((tab) => {
      const IconComponent = tab.icon;
      return (
        <Tooltip key={tab.id} placement="bottom" content={tab.label}>
          <Tab
            className={({ selected }) =>
              `tab-button tab-icon-button ${selected ? "tab-selected" : ""}`
            }
          >
            <IconComponent aria-hidden />
          </Tab>
        </Tooltip>
      );
    })}
  </TabList>
</TabGroup>

  {/* Right section - User menu */}
  <div>
    <Tooltip placement="top" content="User Settings">
      <Menu>
        <MenuTrigger>
          <Button className="saltButton" aria-label="Open Menu">
            <UserIcon aria-hidden />
          </Button>
        </MenuTrigger>
        <MenuPanel>
          <MenuItem onClick={() => setDrawerView("mealHist")}>View Meals</MenuItem>
          <MenuItem onClick={() => setDrawerView("workoutHist")}>View Workouts</MenuItem>
          <MenuItem onClick={() => setDrawerView("settings")}>Settings</MenuItem>
          <MenuItem onClick={handleSignOut}>Logout</MenuItem>
        </MenuPanel>
      </Menu>
    </Tooltip>
  </div>

  {/* Drawer */}
  <Drawer open={drawerView !== "none"} onOpenChange={() => setDrawerView("none")} position="bottom">
    <DrawerCloseButton onClick={() => setDrawerView("none")} />
    {drawerView === "logFood" && <LogFoodPage />}
    {drawerView === "logWorkout" && <WorkoutLogger setDrawerView={setDrawerView} />}
    {drawerView === "mealHist" && <ViewMeals />}
    {drawerView === "workoutHist" && <ViewWorkouts />}
    {drawerView === "logWeight" && <LogWeight />}
    {drawerView === "settings" && <Settings />}
  </Drawer>
</div>
);
};

export default Header;
