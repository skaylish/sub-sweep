// 구독 싹쓸이 - 인사이트 화면
// 중복 구독 탐지 + 거의 안 쓰는 구독 목록 + 해지 체크리스트

import React, { useState } from 'react';
import type { Subscription } from '../models/subscription';
import { CATEGORY_LABELS } from '../models/subscription';
import {
  useSubscriptions,
  selectDuplicates,
  selectRarelyUsed,
} from '../store/subscriptionStore';

// 서비스별 해지 안내 텍스트 (주요 서비스)
const CANCELLATION_GUIDE: Record<string, string> = {
  넷플릭스:       '넷플릭스 앱 → 계정 → 멤버십 해지',
  유튜브프리미엄: 'Google 계정 → 구독 → 유튜브 프리미엄 취소',
  쿠팡와우:       '쿠팡 앱 → 마이쿠팡 → 로켓와우 → 멤버십 해지',
  티빙:           '티빙 앱 → MY → 구독 관리 → 정기 구독 취소',
  웨이브:         '웨이브 앱 → MY → 이용권 → 구독 취소',
  '디즈니+':      '디즈니+ 앱 → 프로필 → 계정 → 구독 취소',
  멜론:           '멜론 앱 → MY → 이용권 → 정기 결제 취소',
  지니:           '지니 앱 → MY → 구독 관리 → 취소',
  스포티파이:     'Spotify 앱 → 계정 → 구독 → 취소',
  어도비:         'Adobe 계정 페이지 → 플랜 관리 → 플랜 취소',
  MS365:          'Microsoft 계정 → 서비스 및 구독 → 취소',
  노션:           'Notion 앱 → Settings → Plans → Cancel plan',
};

function getCancelGuide(name: string): string {
  return CANCELLATION_GUIDE[name] ?? `${name} 공식 앱/사이트 → 계정/구독 설정에서 취소할 수 있어요.`;
}

export const Insights: React.FC = () => {
  const { state } = useSubscriptions();
  const duplicates  = selectDuplicates(state.subscriptions);
  const rarelyUsed  = selectRarelyUsed(state.subscriptions);
  const [openGuide, setOpenGuide] = useState<string | null>(null);

  const fmt = (n: number) => n.toLocaleString('ko-KR');

  const rareTotalSavable = rarelyUsed.reduce((s, sub) => s + sub.monthlyFee, 0);

  return (
    <div className="page page--insights">
      <h1 className="insights__title">절약 인사이트</h1>

      {/* ── 섹션 1: 중복 구독 ────────────────────────────────────────── */}
      <section className="insights-section">
        <h2 className="insights-section__heading">⚠️ 중복 구독</h2>
        {duplicates.length === 0 ? (
          <p className="insights-empty">중복 구독이 없어요. 잘 관리하고 있네요!</p>
        ) : (
          duplicates.map((dup) => (
            <div key={dup.category} className="insight-card insight-card--warning">
              <div className="insight-card__top">
                <span className="insight-card__badge">{CATEGORY_LABELS[dup.category]}</span>
                <span className="insight-card__count">{dup.subscriptions.length}개 구독 중</span>
              </div>
              <div className="insight-card__icons">
                {dup.subscriptions.map((s) => (
                  <span key={s.id} className="insight-card__service">
                    {s.icon} {s.name} ({fmt(s.monthlyFee)}원)
                  </span>
                ))}
              </div>
              <p className="insight-card__tip">
                가장 자주 쓰는 서비스만 남기면{' '}
                <strong>월 {fmt(dup.possibleSave)}원</strong> 절약 가능해요!
              </p>
            </div>
          ))
        )}
      </section>

      {/* ── 섹션 2: 거의 안 쓰는 구독 ──────────────────────────────────── */}
      <section className="insights-section">
        <h2 className="insights-section__heading">💤 거의 안 쓰는 구독</h2>
        {rarelyUsed.length === 0 ? (
          <p className="insights-empty">거의 안 쓰는 구독이 없어요.</p>
        ) : (
          <>
            <p className="insights-section__summary">
              정리하면 월 <strong>{fmt(rareTotalSavable)}원</strong> 절약 가능해요.
            </p>
            {rarelyUsed.map((sub) => (
              <RarelyUsedItem
                key={sub.id}
                sub={sub}
                isOpen={openGuide === sub.id}
                onToggle={() => setOpenGuide(openGuide === sub.id ? null : sub.id)}
              />
            ))}
          </>
        )}
      </section>
    </div>
  );
};

// ─── 거의 안 쓰는 구독 아이템 (해지 가이드 포함) ─────────────────────────────

interface RarelyUsedItemProps {
  sub: Subscription;
  isOpen: boolean;
  onToggle: () => void;
}

const RarelyUsedItem: React.FC<RarelyUsedItemProps> = ({ sub, isOpen, onToggle }) => {
  return (
    <div className="insight-card insight-card--rarely">
      <div className="insight-card__row">
        <span className="insight-card__icon">{sub.icon}</span>
        <span className="insight-card__name">{sub.name}</span>
        <span className="insight-card__fee">{sub.monthlyFee.toLocaleString('ko-KR')}원/월</span>
      </div>
      <button className="btn btn--secondary btn--sm" onClick={onToggle}>
        {isOpen ? '닫기' : '해지 체크리스트 보기'}
      </button>
      {isOpen && (
        <div className="cancel-guide">
          <p className="cancel-guide__text">📋 {getCancelGuide(sub.name)}</p>
        </div>
      )}
    </div>
  );
};
