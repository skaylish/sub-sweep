// 구독 싹쓸이 - 구독 추가/수정 모달 (바텀시트 스타일)

import React, { useState } from 'react';
import type { Subscription, Category, UsageFrequency } from '../models/subscription';
import { CATEGORY_LABELS, FREQUENCY_LABELS } from '../models/subscription';

interface SubscriptionModalProps {
  initial?: Partial<Subscription>;  // 수정 시 기존 값
  onSave: (sub: Omit<Subscription, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  initial,
  onSave,
  onCancel,
}) => {
  const [name, setName]             = useState(initial?.name ?? '');
  const [icon, setIcon]             = useState(initial?.icon ?? '📱');
  const [category, setCategory]     = useState<Category>(initial?.category ?? 'Other');
  const [monthlyFee, setMonthlyFee] = useState(String(initial?.monthlyFee ?? ''));
  const [billingDay, setBillingDay] = useState(String(initial?.billingDay ?? ''));
  const [freq, setFreq]             = useState<UsageFrequency>(initial?.usageFrequency ?? 'sometimes');

  const handleSave = () => {
    const fee = parseInt(monthlyFee, 10);
    const day = parseInt(billingDay, 10);
    if (!name || isNaN(fee) || isNaN(day) || day < 1 || day > 31) return;
    onSave({ name, icon, category, monthlyFee: fee, billingDay: day, usageFrequency: freq });
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        <h2 className="modal-title">구독 {initial?.name ? '수정' : '추가'}</h2>

        {/* 서비스명 */}
        <label className="input-label">서비스명</label>
        <div className="input-row">
          <input
            className="input input--icon"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            maxLength={2}
            placeholder="🎬"
          />
          <input
            className="input input--flex"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 넷플릭스"
          />
        </div>

        {/* 카테고리 */}
        <label className="input-label">카테고리</label>
        <select
          className="input"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          {(Object.entries(CATEGORY_LABELS) as [Category, string][]).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>

        {/* 월 요금 */}
        <label className="input-label">월 요금 (원)</label>
        <input
          className="input"
          type="number"
          inputMode="numeric"
          value={monthlyFee}
          onChange={(e) => setMonthlyFee(e.target.value)}
          placeholder="예: 14900"
        />

        {/* 결제일 */}
        <label className="input-label">매월 결제일</label>
        <input
          className="input"
          type="number"
          inputMode="numeric"
          value={billingDay}
          onChange={(e) => setBillingDay(e.target.value)}
          placeholder="1~31"
          min={1}
          max={31}
        />

        {/* 사용 빈도 */}
        <label className="input-label">사용 빈도</label>
        <div className="freq-buttons">
          {(Object.entries(FREQUENCY_LABELS) as [UsageFrequency, string][]).map(([k, v]) => (
            <button
              key={k}
              className={`freq-btn ${freq === k ? 'freq-btn--active' : ''}`}
              onClick={() => setFreq(k)}
            >
              {v}
            </button>
          ))}
        </div>

        {/* 버튼 */}
        <div className="modal-actions">
          <button className="btn btn--secondary" onClick={onCancel}>취소</button>
          <button className="btn btn--primary" onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  );
};
