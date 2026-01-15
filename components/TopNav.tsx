
import React from 'react';
import { UserRole } from '../types';

interface TopNavProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const TopNav: React.FC<TopNavProps> = ({ role, onRoleChange }) => {
  return (
    <nav className="h-12 bg-[#0078D4] text-white flex items-center justify-between px-4 z-50">
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#005A9E] cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </div>
        <span className="font-semibold text-sm">Proposal Copilot</span>
        <div className="h-4 w-[1px] bg-white/30 mx-2"></div>
        <span className="text-xs text-white/80 opacity-80 uppercase tracking-widest">Prototype</span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium">Viewing as:</span>
          <select 
            value={role}
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            className="bg-[#005A9E] text-white text-xs border-none rounded px-2 py-1 outline-none focus:ring-1 focus:ring-white/50"
          >
            <option value={UserRole.SALES_REP}>{UserRole.SALES_REP}</option>
            <option value={UserRole.MANAGER}>{UserRole.MANAGER}</option>
          </select>
        </div>
        <div className="w-8 h-8 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center text-xs font-bold">
          {role === UserRole.SALES_REP ? 'RS' : 'MJ'}
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
