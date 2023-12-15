"use client";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import { ThemeSwitcher } from "./theme-switcher";
import { Pizza } from "lucide-react";

export default function Nav(props: React.HTMLProps<HTMLDivElement>) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  return (
    <div {...props}>
      <Navbar maxWidth='full' isBordered>
        <NavbarContent className='flex-none w-fit'>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className='md:hidden'
          />
          <NavbarBrand>
            <span className='text-secondary-500'>
              <Pizza />
            </span>
            <p className='ml-unit-xs font-bold text-inherit'>SPLIT.PIZZA</p>
          </NavbarBrand>
        </NavbarContent>
        {/* <NavbarContent className='hidden sm:flex gap-4' justify='center'>
        <NavbarItem isActive>
          <Link href='#' aria-current='page'>
            Splits
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color='foreground' href='#'>
            New
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color='foreground' href='#'>
            Docs
          </Link>
        </NavbarItem>
      </NavbarContent> */}
        <NavbarContent justify='end'>
          <NavbarItem>
            <ThemeSwitcher />
          </NavbarItem>
          <NavbarItem className='hidden lg:flex'>
            <Link href='#'>Login</Link>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} color='primary' href='#' variant='flat'>
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
                }
                className='w-full'
                href='#'
                size='lg'
              >
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </div>
  );
}
