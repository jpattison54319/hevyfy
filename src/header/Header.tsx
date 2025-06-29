import {
  Badge,
  Button, FlexItem, FlexLayout,
  GridItem,
  GridLayout, Menu, MenuItem, MenuPanel, MenuTrigger,
  NavigationItem,
  NavigationItemProps,
  StackLayout,
  Text, Tooltip,
} from "@salt-ds/core";
import {CallIcon, MenuIcon, NotificationIcon, UserIcon} from "@salt-ds/icons";
import { ForwardedRef, forwardRef } from "react";
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
  const { pathname } = useLocation();

  return (
    <FlexLayout as="header" justify={'space-between'} align={'center'} className="app-header">
      <FlexItem >
        <Menu>
          <MenuTrigger>
            <Button appearance="transparent" aria-label="Open Menu">
              <MenuIcon aria-hidden />
            </Button>
          </MenuTrigger>
          <MenuPanel>
            <MenuItem>Copy</MenuItem>
            <MenuItem>Paste</MenuItem>
            <MenuItem>Export</MenuItem>
            <MenuItem>Settings</MenuItem>
          </MenuPanel>
        </Menu>
      </FlexItem>
      <FlexItem >
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
      </FlexItem>
      <FlexItem >
        <Tooltip placement="top" content="User Settings">
          <Button
              appearance="bordered"
              sentiment="accented"
              aria-label="User Settings"
              onClick={handleSignOut}
          >
            <UserIcon />
          </Button>
        </Tooltip>
      </FlexItem>
    </FlexLayout>
  );
};

export default Header;
