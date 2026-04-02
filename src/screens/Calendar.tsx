// 구독 싹쓸이 - 달력 화면
// 월 달력으로 결제 일정을 시각화하고, 날짜 선택 시 바텀시트로 상세 보기

import React, { useState } from 'react';
import type { Subscription } from '../models/subscription';
import { useSubscriptions } from '../store/subscriptionStore';

export const Calendar: React.FC = () => {
  const { state } = useSubscriptions();
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  // 현재 표시 월 (year, month) - 고정: 오늘 기준
  const today = new Date();
  const year  = today.getFullYear();
  const month = today.getMonth(); // 0-indexed

  // 달의 첫 요일과 마지막 날
  const firstDow  = new Date(year, month, 1).getDay(); // 0=일
  const lastDate  = new Date(year, month + 1, 0).getDate();

  // 결제일별 구독 맵
  const billingMap: Record<number, Subscription[]> = {};
  for (const sub of state.subscriptions) {
    const day = sub.billingDay;
    if (day >= 1 && day <= lastDate) {
      if (!billingMap[day]) billingMap[day] = [];
      billingMap[day].push(sub);
    }
  }

  const monthNames = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
  const dowLabels  = ['일','월','화','수','목','금','토'];

  // 바텀시트에 표시할 구독들
  const sheetSubs = selectedDate ? (billingMap[selectedDate] ?? []) : [];
  const sheetTotal = sheetSubs.reduce((s, sub) => s + sub.monthlyFee, 0);

  return (
    <div className="page page--calendar">
      {/* 월 헤더 */}
      <div className="cal__header">
        <h2 className="cal__month">{year}년 {monthNames[month]}</h2>
      </div>

      {/* 요일 헤더 */}
      <div className="cal__dow-row">
        {dowLabels.map((d) => (
          <span key={d} className="cal__dow">{d}</span>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="cal__grid">
        {/* 앞쪽 빈 셀 */}
        {Array.from({ length: firstDow }).map((_, i) => (
          <div key={`empty-${i}`} className="cal__cell cal__cell--empty" />
        ))}

        {/* 날짜 셀 */}
        {Array.from({ length: lastDate }, (_, i) => i + 1).map((d) => {
          const hasBilling = !!billingMap[d];
          const isToday    = d === today.getDate();
          const isSelected = d === selectedDate;
          return (
            <button
              key={d}
              className={[
                'cal__cell',
                isToday    ? 'cal__cell--today'    : '',
                isSelected ? 'cal__cell--selected' : '',
                hasBilling ? 'cal__cell--billing'  : '',
              ].join(' ')}
              onClick={() => setSelectedDate(isSelected ? null : d)}
            >
              <span className="cal__date">{d}</span>
              {hasBilling && (
                <span className="cal__dot">
                  {billingMap[d].length > 1
                    ? `${billingMap[d].length}`
                    : billingMap[d][0].icon}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 결제일 바텀시트 */}
      {selectedDate && (
        <div className="bottom-sheet">
          <div className="bottom-sheet__handle" />
          <h3 className="bottom-sheet__title">
            {monthNames[month]} {selectedDate}일 결제 예정
          </h3>
          {sheetSubs.length === 0 ? (
            <p className="bottom-sheet__empty">이 날 결제되는 구독이 없어요.</p>
          ) : (
            <>
              {sheetSubs.map((sub) => (
                <div key={sub.id} className="bottom-sheet__row">
                  <span>{sub.icon} {sub.name}</span>
                  <span>{sub.monthlyFee.toLocaleString('ko-KR')}원</span>
                </div>
              ))}
              <div className="bottom-sheet__total">
                <span>합계</span>
                <span className="bottom-sheet__total-amount">
                  {sheetTotal.toLocaleString('ko-KR')}원
                </span>
              </div>
            </>
          )}
          <button className="btn btn--secondary btn--full" onClick={() => setSelectedDate(null)}>
            닫기
          </button>
        </div>
      )}
    </div>
  );
};
