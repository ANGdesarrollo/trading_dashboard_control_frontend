"use client"

import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const NavigationMenu = React.forwardRef<
  React.ElementRef<"nav">,
  React.ComponentPropsWithoutRef<"nav">
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className
    )}
    {...props}
  />
))
NavigationMenu.displayName = "NavigationMenu"

const NavigationMenuList = React.forwardRef<
  React.ElementRef<"ul">,
  React.ComponentPropsWithoutRef<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center space-x-1",
      className
    )}
    {...props}
  />
))
NavigationMenuList.displayName = "NavigationMenuList"

const NavigationMenuItem = React.forwardRef<
  React.ElementRef<"li">,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
NavigationMenuItem.displayName = "NavigationMenuItem"

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
)

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<"button">,
  React.ComponentPropsWithoutRef<"button">
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  />
))
NavigationMenuTrigger.displayName = "NavigationMenuTrigger"

const NavigationMenuLink = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), className)}
    {...props}
  />
))
NavigationMenuLink.displayName = "NavigationMenuLink"

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuLink,
}