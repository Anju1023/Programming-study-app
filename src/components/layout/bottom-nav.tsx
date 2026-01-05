"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, User, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "ホーム", href: "/learn", icon: Map },
  { label: "XP", href: "/ranking", icon: Trophy },
  { label: "プロフィール", href: "/profile", icon: User },
];

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-slate-200 bg-white pb-safe lg:hidden">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl p-2 transition-all",
                isActive ? "text-duo-blue" : "text-slate-400 hover:bg-slate-50",
              )}
            >
              <Icon size={24} className={isActive ? "fill-duo-blue/10" : ""} />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
