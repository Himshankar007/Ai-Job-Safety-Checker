import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldAlert,
  FileSearch,
  Building2,
  GraduationCap,
  MessageSquare,
  X,
} from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/detect", label: "Fraud Detection", icon: ShieldAlert },
  { to: "/ats", label: "Resume ATS", icon: FileSearch },
  { to: "/company", label: "Company Analysis", icon: Building2 },
  { to: "/skills", label: "Skill Gap", icon: GraduationCap },
  { to: "/interview", label: "Interview AI", icon: MessageSquare },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Overlay (mobile) */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity md:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed z-50 md:z-30 top-0 left-0 h-full w-[280px] p-4 md:p-5 transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full glass border border-stroke rounded-2xl overflow-hidden">
          <div className="h-[70px] px-5 flex items-center justify-between border-b border-stroke">
            <div className="text-lg font-black tracking-tight">
              <span className="text-ink">SafeJob</span>{" "}
              <span className="text-primary">AI</span>
            </div>
            <button
              onClick={onClose}
              className="md:hidden p-2 rounded-xl bg-white/5 border border-stroke hover:bg-white/10 transition"
              aria-label="Close navigation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="p-3">
            <div className="px-3 pt-2 pb-3 text-[11px] uppercase tracking-[0.2em] text-muted">
              Navigation
            </div>

            <ul className="space-y-1.5">
              {links.map(({ to, label, icon: Icon, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl border transition",
                        isActive
                          ? "bg-primary/15 border-primary/30 text-ink"
                          : "bg-white/0 border-transparent text-muted hover:bg-white/5 hover:border-stroke",
                      ].join(" ")
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-semibold">{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto p-4 border-t border-stroke">
            <div className="rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/10 border border-primary/20 p-4">
              <div className="text-sm font-extrabold">Tip</div>
              <div className="text-xs text-muted mt-1 leading-relaxed">
                Use Fraud Detection for job posts, then optimize your resume with
                ATS.
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

