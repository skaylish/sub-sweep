// 구독 싹쓸이 - 구독 리스트 아이템 컴포넌트

import React from 'react';
import type { Subscription } from '../models/subscription';
import { FREQUENCY_LABELS } from '../models/subscription';
import { selectDDay, formatDDay } from '../store/subscriptionStore';

interface Props {
  sub: Subscription;
  onEdit?: (sub: Subscription) => void;
}

export const SubscriptionListItem: React.FC<Props> = ({ sub, onEdit }) => {
  const dday = selectDDay(sub.billingDay);
  const ddayText = formatDDay(dday);
  const isUrgent = dday <= 3;

  return (
    <div className="list-item" onClick={() => onEdit?.(sub)}>
      <div className="list-item__icon">{sub.icon}</div>
      <div className="list-item__body">
        <span className="list-item__name">{sub.name}</span>
        <span className="list-item__freq">{FREQUENCY_LABELS[sub.usageFrequency]}</span>
      </div>
      <div className="list-item__right">
        <span className="list-item__fee">{sub.monthlyFee.toLocaleString('ko-KR')}원</span>
        <span className={`list-item__dday ${isUrgent ? 'list-item__dday--urgent' : ''}`}>
          {ddayText}
        </span>
      </div>
    </div>
  );
};
