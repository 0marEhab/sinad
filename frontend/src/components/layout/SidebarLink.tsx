import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  to: string;
}

export const SidebarLink = ({ icon, label, to }: SidebarLinkProps) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex items-center gap-3 px-4 py-2.5 rounded transition-colors ${isActive ? 'bg-sidebar-active text-brand-dark font-semibold' : 'text-gray-400 hover:text-white'}`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
};
