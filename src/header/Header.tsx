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
const TABS = ["Pet", "Skills", "Quests", "Routines"] as const;

type DrawerTypes = "none" | "logFood" | "logWorkout" | "workoutHist" | "mealHist" | "logWeight";
type HeaderProps = {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
};
// Check App header pattern: https://www.saltdesignsystem.com/salt/patterns/app-header
const Header = ({ selectedIndex, setSelectedIndex }: HeaderProps) => {
  const [drawerView, setDrawerView] = useState<DrawerTypes>("none");
  const { pathname } = useLocation();

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
  <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
    <TabList className="tab-nav">
      {TABS.map((tab, index) => (
        <Tab
          key={tab}
          className={({ selected }) => `tab-button ${selected ? "tab-selected" : ""}`}
        >
          {tab}
        </Tab>
      ))}
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
  </Drawer>
</div>
);
};

export default Header;
