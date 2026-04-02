// 구독 싹쓸이 - 하단 탭 내비게이션 컴포넌트

import React from 'react';

export type TabName = 'dashboard' | 'calendar' | 'insights';

interface TabBarProps {
  active: TabName;
  onChange: (tab: TabName) => void;
}

const TABS: { key: TabName; label: string; icon: string }[] = [
  { key: 'dashboard', label: '대시보드', icon: '🏠' },
  { key: 'calendar',  label: '캘린더',   icon: '📅' },
  { key: 'insights',  label: '인사이트', icon: '💡' },
];

export const TabBar: React.FC<TabBarProps> = ({ active, onChange }) => {
  return (
    <nav className="tab-bar">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          className={`tab-bar__item ${active === tab.key ? 'tab-bar__item--active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          <span className="tab-bar__icon">{tab.icon}</span>
          <span className="tab-bar__label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};
