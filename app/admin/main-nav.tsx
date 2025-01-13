"use client"

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const links = [
    {
        title:"Overview",
        href:"/admin/overview"
    },
    {
        title:"Products",
        href:"/admin/products"
    },
    {
        title:"Orders",
        href:"/admin/orders"
    },
    {
        title:"Users",
        href:"/admin/users"
    },
]
const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
    const pathname = usePathname()
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
   {...props} >
       {links.map(link=>(
        <Link className={cn('text-sm font-medium hover:text-primary transition-colors',pathname.includes(link.href)?"":"text-muted-foreground")} key={link.href} href={link.href}> {link.title}</Link>
       ))}
    </nav>
  );
};

export default MainNav;
