"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { TrendingUp, BarChart3, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    name: "Symbols",
    href: "/symbol",
    icon: TrendingUp,
  },
  {
    name: "Operations",
    href: "/operation",
    icon: BarChart3,
  },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6" legacyBehavior>
            <TrendingUp className="h-6 w-6" />
            <span className="hidden font-bold lg:inline-block">
              Trading Dashboard
            </span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <NavigationMenuItem key={item.name}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                          isActive && "bg-accent text-accent-foreground"
                        )}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Navigation */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="flex items-center gap-2 md:hidden" legacyBehavior>
              <TrendingUp className="h-6 w-6" />
              <span className="font-bold">Trading Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <div className="border-t border-border/40 md:hidden">
        <nav className="flex items-center space-x-4 px-4 py-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-accent text-accent-foreground"
                )}
                legacyBehavior>
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}