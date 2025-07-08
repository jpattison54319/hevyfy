import {
  Badge,
  Button, Drawer, FlexItem, FlexLayout,
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

// Check App header pattern: https://www.saltdesignsystem.com/salt/patterns/app-header
const Header = () => {
const [drawerView, setDrawerView] = useState<"none" | "logFood" | "logWorkout" | "workoutHist" | "mealHist">("none");
  const { pathname } = useLocation();

  return (
    <div  className="app-header">
      < >
        <Menu>
          <MenuTrigger>
            <Button appearance="bordered"
              sentiment="accented" aria-label="Open Menu">
              <AddIcon aria-hidden />
            </Button>
          </MenuTrigger>
          <MenuPanel>
            <MenuItem onClick={() => setDrawerView('logFood')} >Log Food</MenuItem>
            <MenuItem onClick={() => setDrawerView('logWorkout')}>Log Workout</MenuItem>
          </MenuPanel>
        </Menu>
      </>
      < >
        <nav>
          <StackLayout direction="row" gap={1} role="list">
            {routes.map((r) => (
              <div role="listitem" key={r.name}>
                <NavLink active={pathname === r.path} to={r.path}>
                  {r.name}
                </NavLink>
              </div>
            ))}
          </StackLayout>
        </nav>
      </>
      < >
        <Tooltip placement="top" content="User Settings">
                  <Menu>
          <MenuTrigger>
            <Button appearance="bordered"
              sentiment="accented" aria-label="Open Menu">
              <UserIcon aria-hidden />
            </Button>
          </MenuTrigger>
          <MenuPanel>
            <MenuItem onClick={() => setDrawerView('mealHist')} >View Meals</MenuItem>
            <MenuItem onClick={() => setDrawerView('workoutHist')}>View Workouts</MenuItem>
            <MenuItem onClick={handleSignOut}>Logout</MenuItem>
          </MenuPanel>
        </Menu>
        </Tooltip>
      </>
       <Drawer open={drawerView !== "none"} onOpenChange={() => setDrawerView('none')} position="bottom">
         {drawerView === "logFood" && <LogFoodPage />}
        {drawerView === "logWorkout" && <WorkoutLogger setDrawerView={setDrawerView}/> }
        {drawerView === "mealHist" && <ViewMeals /> }
      </Drawer>
    </div>
  );
};

export default Header;
