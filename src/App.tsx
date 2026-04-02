// 구독 싹쓸이 - 앱 루트: 라우팅 및 전체 레이아웃

import { useState } from 'react';
import { SubscriptionProvider, useSubscriptions } from './store/subscriptionStore';
import type { TabName } from './components/TabBar';
import { TabBar } from './components/TabBar';
import { Onboarding } from './screens/Onboarding';
import { Dashboard }  from './screens/Dashboard';
import { Calendar }   from './screens/Calendar';
import { Insights }   from './screens/Insights';
import { Report }     from './screens/Report';
import './index.css';

// 라우트 타입
type Route = 'onboarding' | TabName | 'report';

function AppInner() {
  const { state } = useSubscriptions();
  // 온보딩 완료 여부에 따라 초기 라우트 결정
  const [route, setRoute] = useState<Route>(
    state.onboardingDone ? 'dashboard' : 'onboarding'
  );

  // 탭바는 메인 화면에서만 표시
  const showTabBar = route === 'dashboard' || route === 'calendar' || route === 'insights';

  const handleTabChange = (tab: TabName) => setRoute(tab);

  return (
    <div className="app">
      {/* 헤더 (온보딩/리포트 제외) */}
      {showTabBar && (
        <header className="app-header">
          <span className="app-header__logo">🧹</span>
          <span className="app-header__title">구독 싹쓸이</span>
        </header>
      )}

      {/* 라우트별 화면 렌더링 */}
      <main className={`app-main ${showTabBar ? 'app-main--with-tab' : ''}`}>
        {route === 'onboarding' && (
          <Onboarding onDone={() => setRoute('dashboard')} />
        )}
        {route === 'dashboard' && (
          <Dashboard onNavigateReport={() => setRoute('report')} />
        )}
        {route === 'calendar' && <Calendar />}
        {route === 'insights' && <Insights />}
        {route === 'report'   && (
          <Report onNavigateInsights={() => setRoute('insights')} />
        )}
      </main>

      {/* 하단 탭 바 */}
      {showTabBar && (
        <TabBar
          active={route as TabName}
          onChange={handleTabChange}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <SubscriptionProvider>
      <AppInner />
    </SubscriptionProvider>
  );
}
