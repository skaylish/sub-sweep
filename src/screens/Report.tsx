// 구독 싹쓸이 - AI 절약 리포트 화면
// 보상형 광고 완료 후 진입. 로컬 리포트(폴백)를 기본으로 표시하고,
// 실제 서비스에서는 Claude API를 통해 LLM 리포트를 생성한다.

import React, { useEffect, useState } from 'react';
import {
  useSubscriptions,
  selectDuplicates,
  selectRarelyUsed,
  selectTotalThisMonth,
} from '../store/subscriptionStore';
import { buildReportInput, generateLocalReport } from '../services/report';

interface ReportProps {
  onNavigateInsights: () => void;
}

export const Report: React.FC<ReportProps> = ({ onNavigateInsights }) => {
  const { state } = useSubscriptions();
  const [reportText, setReportText] = useState<string>('');
  const [loading, setLoading]       = useState(true);

  const input = buildReportInput(state.subscriptions, state.lastMonthTotal);

  const duplicates  = selectDuplicates(state.subscriptions);
  const rarelyUsed  = selectRarelyUsed(state.subscriptions);
  const total       = selectTotalThisMonth(state.subscriptions);
  const diff        = total - state.lastMonthTotal;
  const diffSign    = diff >= 0 ? '+' : '';
  const fmt         = (n: number) => n.toLocaleString('ko-KR');

  // 절약 가능 TOP 3
  const savableItems = [
    ...duplicates.map((d) => ({
      label: `${d.subscriptions.map((s) => s.name).join(' + ')} 중 1개 정리`,
      save: d.possibleSave,
    })),
    ...rarelyUsed.map((s) => ({
      label: `${s.name} 해지`,
      save: s.monthlyFee,
    })),
  ]
    .sort((a, b) => b.save - a.save)
    .slice(0, 3);

  const totalSavable = savableItems.reduce((s, item) => s + item.save, 0);

  useEffect(() => {
    // 로컬 리포트 생성 (즉시)
    // 실제 서비스에서는 여기서 Claude API 호출:
    //   const prompt = buildLLMPrompt(input);
    //   const response = await anthropic.messages.create({ ... });
    //   setReportText(response.content[0].text);
    const text = generateLocalReport(input);
    setReportText(text);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page page--report">
      <header className="report__header">
        <h1 className="report__title">✨ 이번 달 구독 절약 리포트</h1>
      </header>

      {/* 1. 전체 요약 */}
      <div className="report-card">
        <h2 className="report-card__heading">📊 전체 요약</h2>
        <div className="report-card__row">
          <span>이번 달 총액</span>
          <strong>{fmt(total)}원</strong>
        </div>
        <div className={`report-card__row ${diff > 0 ? 'color--red' : diff < 0 ? 'color--green' : ''}`}>
          <span>지난 달 대비</span>
          <strong>{diffSign}{fmt(diff)}원</strong>
        </div>
      </div>

      {/* 2. 줄일 수 있는 구독 TOP 3 */}
      <div className="report-card">
        <h2 className="report-card__heading">💰 줄일 수 있는 구독 TOP {savableItems.length}</h2>
        {savableItems.length === 0 ? (
          <p className="report-card__empty">아주 잘 관리하고 있어요!</p>
        ) : (
          savableItems.map((item, i) => (
            <div key={i} className="report-card__row">
              <span>{i + 1}. {item.label}</span>
              <strong>월 {fmt(item.save)}원</strong>
            </div>
          ))
        )}
      </div>

      {/* 3. 절약 시나리오 */}
      {totalSavable > 0 && (
        <div className="report-card">
          <h2 className="report-card__heading">📅 절약 시나리오</h2>
          <div className="report-card__row">
            <span>1개월 절약</span>
            <strong>{fmt(totalSavable)}원</strong>
          </div>
          <div className="report-card__row">
            <span>3개월 절약</span>
            <strong>{fmt(totalSavable * 3)}원</strong>
          </div>
          <div className="report-card__row">
            <span>1년 절약</span>
            <strong className="color--green">{fmt(totalSavable * 12)}원</strong>
          </div>
        </div>
      )}

      {/* AI 리포트 텍스트 (로컬 생성 or LLM) */}
      <div className="report-card report-card--ai">
        <h2 className="report-card__heading">🤖 AI 분석 리포트</h2>
        {loading ? (
          <p className="report-card__loading">분석 중...</p>
        ) : (
          <pre className="report-card__text">{reportText}</pre>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="report__footer">
        <button className="btn btn--primary btn--full" onClick={onNavigateInsights}>
          해지 체크리스트 모아보기
        </button>
      </div>
    </div>
  );
};
