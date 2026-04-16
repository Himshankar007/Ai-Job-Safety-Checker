import React from "react";
import { Bell, Search, User } from "lucide-react";

export default function Topbar({ onToggleSidebar }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div className="h-[70px] flex items-center px-4 md:px-6 gap-3 glass rounded-none border-b border-stroke">
        <button
          onClick={onToggleSidebar}
          className="md:hidden px-3 py-2 rounded-xl bg-black/5 border border-stroke hover:bg-black/10 transition"
          aria-label="Toggle navigation"
        >
          <span className="block w-5 h-[2px] bg-ink/80 mb-1" />
          <span className="block w-5 h-[2px] bg-ink/80 mb-1" />
          <span className="block w-5 h-[2px] bg-ink/80" />
        </button>

        <div className="hidden md:flex items-center gap-2 text-sm font-extrabold tracking-tight">
          <span className="text-ink">AI Job Safety </span>
          <span className="text-primary">Checker</span>
        </div>

        <div className="flex-1 flex items-center justify-center md:justify-start">
          <div className="w-full max-w-xl relative">
            <Search className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              placeholder="Search tools, pages..."
              className="w-full bg-black/5 border border-stroke rounded-2xl pl-11 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 text-black placeholder:text-muted"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-2xl bg-black/5 border border-stroke hover:bg-black/10 transition">
            <Bell className="w-4 h-4 text-ink" />
          </button>
          <button className="p-2.5 rounded-2xl bg-black/5 border border-stroke hover:bg-black/10 transition">
            <User className="w-4 h-4 text-ink" />
          </button>
        </div>
      </div>
    </header>
  );
}

