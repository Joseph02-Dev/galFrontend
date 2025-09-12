import { useState } from "react";

export default function SidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="md:hidden fixed left-4 top-20 z-50 btn btn-soft btn-warning text-white px-4 py-2 rounded-full shadow-lg"
      onClick={onClick}
      aria-label="Ouvrir le menu"
    >
      ☰ 
    </button>
  );
}
