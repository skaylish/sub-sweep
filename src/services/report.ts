// 구독 싹쓸이 - AI 절약 리포트 데이터 준비 서비스

import type { Subscription } from '../models/subscription';
import type { DuplicateGroup } from '../store/subscriptionStore';
import {
  selectTotalThisMonth,
  selectDuplicates,
  selectRarelyUsed,
} from '../store/subscriptionStore';

// ─── 리포트 입력 데이터 타입 ──────────────────────────────────────────────────

export interface ReportInput {
  totalThisMonth: number;
  changeFromLastMonth: number;
  duplicateCategories: {
    category: string;
    count: number;
    possibleSave: number;
  }[];
  rarelyUsed: {
    name: string;
    monthlyFee: number;
  }[];
}

// ─── 리포트 입력 데이터 생성 ───────────────────────────────────────────────────

export function buildReportInput(
  subscriptions: Subscription[],
  lastMonthTotal: number
): ReportInput {
  const totalThisMonth = selectTotalThisMonth(subscriptions);
  const changeFromLastMonth = totalThisMonth - lastMonthTotal;
  const duplicates: DuplicateGroup[] = selectDuplicates(subscriptions);
  const rarelyUsed = selectRarelyUsed(subscriptions);

  return {
    totalThisMonth,
    changeFromLastMonth,
    duplicateCategories: duplicates.map((d) => ({
      category: d.category,
      count: d.subscriptions.length,
      possibleSave: d.possibleSave,
    })),
    rarelyUsed: rarelyUsed.map((s) => ({
      name: s.name,
      monthlyFee: s.monthlyFee,
    })),
  };
}

// ─── LLM 프롬프트 생성 ────────────────────────────────────────────────────────

/**
 * LLM(예: Claude API)에 전달할 프롬프트를 생성한다.
 *
 * 사용 예시:
 *   const input = buildReportInput(subscriptions, lastMonthTotal);
 *   const prompt = buildLLMPrompt(input);
 *   const response = await anthropic.messages.create({
 *     model: 'claude-opus-4-6',
 *     max_tokens: 1024,
 *     messages: [{ role: 'user', content: prompt }],
 *   });
 *   const reportText = response.content[0].text;
 */
export function buildLLMPrompt(input: ReportInput): string {
  const dataJson = JSON.stringify(input, null, 2);

  return `
당신은 개인 재무 절약 도우미입니다.
아래 JSON 데이터를 분석하여 사용자에게 친절하고 실용적인 한국어 구독 절약 리포트를 작성해주세요.

리포트에 포함할 내용:
1. 이번 달 총 구독 지출 요약 및 지난 달 대비 증감 평가
2. 중복 구독이 있는 카테고리와 절약 가능 금액 설명
3. 거의 사용하지 않는 구독 목록과 해지 권고
4. 1개월 / 3개월 / 1년 기준 절약 시나리오 (숫자 포함)
5. 응원 문구로 마무리

말투: 친근하고 따뜻하게, 숫자는 "XX,XXX원" 형식으로 표기.
분량: 250~350자 이내.

--- 분석 데이터 ---
${dataJson}
`.trim();
}

// ─── 클라이언트 사이드 로컬 리포트 생성 (LLM 없이 동작하는 폴백) ──────────────────

export function generateLocalReport(input: ReportInput): string {
  const fmt = (n: number) => n.toLocaleString('ko-KR');

  const lines: string[] = [];

  // 1. 이번 달 요약
  const changeSign = input.changeFromLastMonth >= 0 ? '+' : '';
  lines.push(`📊 이번 달 구독 총액은 ${fmt(input.totalThisMonth)}원이에요.`);
  lines.push(
    `지난 달보다 ${changeSign}${fmt(input.changeFromLastMonth)}원 ${
      input.changeFromLastMonth > 0 ? '늘었어요.' : input.changeFromLastMonth < 0 ? '줄었어요 🎉' : '동일해요.'
    }`
  );
  lines.push('');

  // 2. 중복 구독
  if (input.duplicateCategories.length > 0) {
    lines.push('⚠️ 중복 구독 발견!');
    for (const d of input.duplicateCategories) {
      lines.push(
        `  · ${d.category} 카테고리에 ${d.count}개 구독 중. 정리하면 월 ${fmt(d.possibleSave)}원 절약 가능해요.`
      );
    }
    lines.push('');
  }

  // 3. 거의 안 쓰는 구독
  if (input.rarelyUsed.length > 0) {
    lines.push('💤 거의 안 쓰는 구독');
    for (const r of input.rarelyUsed) {
      lines.push(`  · ${r.name} (월 ${fmt(r.monthlyFee)}원) — 해지를 고려해보세요.`);
    }
    lines.push('');
  }

  // 4. 절약 시나리오
  const totalSavable =
    input.duplicateCategories.reduce((s, d) => s + d.possibleSave, 0) +
    input.rarelyUsed.reduce((s, r) => s + r.monthlyFee, 0);

  if (totalSavable > 0) {
    lines.push('💰 절약 시나리오');
    lines.push(`  · 1개월 절약: ${fmt(totalSavable)}원`);
    lines.push(`  · 3개월 절약: ${fmt(totalSavable * 3)}원`);
    lines.push(`  · 1년 절약: ${fmt(totalSavable * 12)}원`);
    lines.push('');
  }

  lines.push('✨ 작은 정리가 큰 절약으로 이어져요. 오늘 하나씩 시작해보세요!');

  return lines.join('\n');
}
