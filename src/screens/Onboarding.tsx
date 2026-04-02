// 구독 싹쓸이 - 온보딩 화면
// 자주 쓰는 구독 서비스를 아이콘 그리드에서 선택하고,
// 모달로 월 요금 / 결제일 / 사용 빈도를 입력한다.

import React, { useState } from 'react';
import type { PresetService, Subscription } from '../models/subscription';
import { PRESET_SERVICES } from '../models/subscription';
import { useSubscriptions } from '../store/subscriptionStore';
import { SubscriptionModal } from '../components/SubscriptionModal';

interface OnboardingProps {
  onDone: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onDone }) => {
  const { state, dispatch } = useSubscriptions();
  // 현재 편집 중인 프리셋 서비스
  const [editing, setEditing] = useState<PresetService | null>(null);
  // 이미 추가된 서비스 키 목록
  const addedKeys = new Set(state.subscriptions.map((s) => s.name));

  const handlePresetClick = (preset: PresetService) => {
    setEditing(preset);
  };

  const handleSave = (data: Omit<Subscription, 'id' | 'createdAt'>) => {
    const id = `sub-${Date.now()}`;
    dispatch({
      type: 'ADD_SUBSCRIPTION',
      payload: { ...data, id, createdAt: new Date().toISOString() },
    });
    setEditing(null);
  };

  const handleDone = () => {
    dispatch({ type: 'FINISH_ONBOARDING' });
    onDone();
  };

  return (
    <div className="page page--onboarding">
      <header className="onboarding__header">
        <h1 className="onboarding__title">지금 쓰는 구독을 골라주세요</h1>
        <p className="onboarding__subtitle">선택 후 요금과 결제일을 입력해요</p>
      </header>

      {/* 프리셋 아이콘 그리드 */}
      <div className="preset-grid">
        {PRESET_SERVICES.map((preset) => {
          const added = addedKeys.has(preset.name);
          return (
            <button
              key={preset.key}
              className={`preset-card ${added ? 'preset-card--added' : ''}`}
              onClick={() => handlePresetClick(preset)}
            >
              <span className="preset-card__icon">{preset.icon}</span>
              <span className="preset-card__name">{preset.name}</span>
              {added && <span className="preset-card__check">✓</span>}
            </button>
          );
        })}
      </div>

      {/* 추가된 구독 요약 */}
      {state.subscriptions.length > 0 && (
        <p className="onboarding__summary">
          {state.subscriptions.length}개 구독 추가됨 ·{' '}
          월 {state.subscriptions.reduce((s, sub) => s + sub.monthlyFee, 0).toLocaleString('ko-KR')}원
        </p>
      )}

      {/* 완료 버튼 */}
      <div className="onboarding__footer">
        <button
          className="btn btn--primary btn--full"
          onClick={handleDone}
          disabled={state.subscriptions.length === 0}
        >
          다 입력했어요
        </button>
      </div>

      {/* 구독 추가 모달 */}
      {editing && (
        <SubscriptionModal
          initial={{
            name: editing.name,
            icon: editing.icon,
            category: editing.category,
            monthlyFee: editing.defaultFee,
          }}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
};
