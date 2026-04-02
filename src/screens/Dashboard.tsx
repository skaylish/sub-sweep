// 구독 싹쓸이 - 대시보드 화면
// 이번 달 총액, 카테고리 필터, 구독 리스트, AI 리포트 버튼, 배너 광고

import React, { useState } from 'react';
import type { Category, Subscription } from '../models/subscription';
import {
  useSubscriptions,
  selectTotalThisMonth,
} from '../store/subscriptionStore';
import { SubscriptionListItem } from '../components/SubscriptionListItem';
import { SubscriptionModal } from '../components/SubscriptionModal';
import { BannerAd } from '../components/BannerAd';
import { showRewardAd, AD_PLACEMENT } from '../services/ad';

interface DashboardProps {
  onNavigateReport: () => void;
}

const ALL = 'all' as const;
type FilterTab = typeof ALL | Category;

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all',          label: '전체' },
  { key: 'OTT',         label: 'OTT' },
  { key: 'Music',       label: '음악' },
  { key: 'Productivity',label: '생산성' },
  { key: 'Other',       label: '기타' },
];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateReport }) => {
  const { state, dispatch } = useSubscriptions();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [editingSub, setEditingSub]     = useState<Subscription | null>(null);
  const [adLoading, setAdLoading]       = useState(false);

  const total = selectTotalThisMonth(state.subscriptions);
  const diff  = total - state.lastMonthTotal;
  const diffSign = diff >= 0 ? '+' : '';
  const fmt = (n: number) => n.toLocaleString('ko-KR');

  // 카테고리 필터 적용
  const filtered = activeFilter === 'all'
    ? state.subscriptions
    : state.subscriptions.filter((s) => s.category === activeFilter);

  // 구독 수정 저장
  const handleUpdate = (data: Omit<Subscription, 'id' | 'createdAt'>) => {
    if (!editingSub) return;
    dispatch({
      type: 'UPDATE_SUBSCRIPTION',
      payload: { ...editingSub, ...data },
    });
    setEditingSub(null);
  };

  // AI 리포트 버튼 클릭 → 보상형 광고 → 리포트 화면
  const handleReportClick = async () => {
    setAdLoading(true);
    try {
      const ok = await showRewardAd(AD_PLACEMENT.REPORT_UNLOCK);
      if (ok) {
        dispatch({ type: 'UNLOCK_REPORT' });
        onNavigateReport();
      } else {
        alert('광고를 완료하면 리포트를 볼 수 있어요.');
      }
    } finally {
      setAdLoading(false);
    }
  };

  return (
    <div className="page page--dashboard">
      {/* 상단 요약 카드 */}
      <div className="summary-card">
        <span className="summary-card__label">이번 달 구독 예상 지출</span>
        <span className="summary-card__total">{fmt(total)}원</span>
        <span className={`summary-card__diff ${diff > 0 ? 'summary-card__diff--up' : diff < 0 ? 'summary-card__diff--down' : ''}`}>
          지난 달보다 {diffSign}{fmt(diff)}원
        </span>
      </div>

      {/* 카테고리 필터 탭 */}
      <div className="filter-tabs">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`filter-tab ${activeFilter === tab.key ? 'filter-tab--active' : ''}`}
            onClick={() => setActiveFilter(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 구독 리스트 */}
      <div className="list">
        {filtered.length === 0 ? (
          <p className="empty-message">이 카테고리에 구독이 없어요.</p>
        ) : (
          filtered.map((sub) => (
            <SubscriptionListItem
              key={sub.id}
              sub={sub}
              onEdit={(s) => setEditingSub(s)}
            />
          ))
        )}
      </div>

      {/* 배너 광고 영역 */}
      <BannerAd placementId={AD_PLACEMENT.DASHBOARD_BANNER} />

      {/* AI 리포트 버튼 (하단 고정) */}
      <div className="dashboard__footer">
        <button
          className="btn btn--primary btn--full"
          onClick={handleReportClick}
          disabled={adLoading}
        >
          {adLoading ? '광고 로딩 중...' : '✨ AI 절약 리포트 보기 (광고)'}
        </button>
      </div>

      {/* 구독 수정 모달 */}
      {editingSub && (
        <SubscriptionModal
          initial={editingSub}
          onSave={handleUpdate}
          onCancel={() => setEditingSub(null)}
        />
      )}
    </div>
  );
};
