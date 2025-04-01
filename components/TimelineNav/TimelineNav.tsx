"use client"

import {
  Navbar, 
  NavbarProps, 
  NavbarContent, 
  NavbarItem, 
  Link
} from "@heroui/react";

interface TimelineNavProps extends NavbarProps {
  editing? : boolean
}

const TimelineNav = (
  {
    editing,
    ...props
  }: {
    editing?: boolean
  } & TimelineNavProps
) => {
  return (
    <Navbar {...props}>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current="page" href="#">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

export default TimelineNav;