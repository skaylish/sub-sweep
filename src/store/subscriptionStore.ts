// 구독 싹쓸이 - 전역 상태 관리 (React Context + useReducer)

import { createContext, useContext, useReducer, createElement } from 'react';
import type { ReactNode } from 'react';
import type { Subscription, Category } from '../models/subscription';
import { DUMMY_SUBSCRIPTIONS } from '../models/subscription';

// ─── 상태 타입 ─────────────────────────────────────────────────────────────────

export interface SubscriptionState {
  subscriptions: Subscription[];
  lastMonthTotal: number;   // 지난 달 총액 (초기엔 이번 달과 동일)
  reportUnlocked: boolean;  // 광고 시청 후 리포트 해금 여부
  onboardingDone: boolean;  // 온보딩 완료 여부
}

// ─── 액션 타입 ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'ADD_SUBSCRIPTION';    payload: Subscription }
  | { type: 'UPDATE_SUBSCRIPTION'; payload: Subscription }
  | { type: 'REMOVE_SUBSCRIPTION'; payload: string }      // id
  | { type: 'UNLOCK_REPORT' }
  | { type: 'FINISH_ONBOARDING' }
  | { type: 'RESET' };

// ─── 초기 상태 ─────────────────────────────────────────────────────────────────

function buildInitialState(): SubscriptionState {
  const subs = DUMMY_SUBSCRIPTIONS;
  const total = subs.reduce((sum, s) => sum + s.monthlyFee, 0);
  return {
    subscriptions: subs,
    lastMonthTotal: total,  // 초기엔 같은 값으로 시작
    reportUnlocked: false,
    onboardingDone: false,
  };
}

// ─── 리듀서 ────────────────────────────────────────────────────────────────────

function reducer(state: SubscriptionState, action: Action): SubscriptionState {
  switch (action.type) {
    case 'ADD_SUBSCRIPTION':
      return { ...state, subscriptions: [...state.subscriptions, action.payload] };

    case 'UPDATE_SUBSCRIPTION':
      return {
        ...state,
        subscriptions: state.subscriptions.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };

    case 'REMOVE_SUBSCRIPTION':
      return {
        ...state,
        subscriptions: state.subscriptions.filter((s) => s.id !== action.payload),
      };

    case 'UNLOCK_REPORT':
      return { ...state, reportUnlocked: true };

    case 'FINISH_ONBOARDING':
      return { ...state, onboardingDone: true };

    case 'RESET':
      return buildInitialState();

    default:
      return state;
  }
}

// ─── 셀렉터 함수 (파생 데이터 계산) ─────────────────────────────────────────────

/** 이번 달 구독 총액 */
export function selectTotalThisMonth(subs: Subscription[]): number {
  return subs.reduce((sum, s) => sum + s.monthlyFee, 0);
}

/** D-Day 계산: 오늘 기준 다음 결제일까지 남은 일수 */
export function selectDDay(billingDay: number, today = new Date()): number {
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();

  let nextBilling = new Date(year, month, billingDay);
  if (nextBilling.getDate() < day || (nextBilling.getDate() === day)) {
    // 이미 지났거나 오늘이면 다음 달로
    if (billingDay < day) {
      nextBilling = new Date(year, month + 1, billingDay);
    }
  }
  const diff = Math.ceil(
    (nextBilling.getTime() - new Date(year, month, day).getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff;
}

/** D-Day 텍스트 포맷 */
export function formatDDay(dday: number): string {
  if (dday === 0) return '오늘';
  if (dday < 0) return `D+${Math.abs(dday)}`;
  return `D-${dday}`;
}

/** 카테고리별 구독 그룹 */
export function selectByCategory(subs: Subscription[]): Record<Category, Subscription[]> {
  const result: Record<Category, Subscription[]> = {
    OTT: [], Music: [], Productivity: [], Cloud: [], Other: [],
  };
  for (const s of subs) {
    result[s.category].push(s);
  }
  return result;
}

/** 중복 구독 (같은 카테고리 2개 이상) 탐지 */
export interface DuplicateGroup {
  category: Category;
  subscriptions: Subscription[];
  possibleSave: number; // 가장 저렴한 하나만 남길 때 절약 금액
}

export function selectDuplicates(subs: Subscription[]): DuplicateGroup[] {
  const byCategory = selectByCategory(subs);
  const result: DuplicateGroup[] = [];

  for (const [cat, list] of Object.entries(byCategory) as [Category, Subscription[]][]) {
    if (list.length >= 2) {
      const sortedByFee = [...list].sort((a, b) => a.monthlyFee - b.monthlyFee);
      const cheapest = sortedByFee[0].monthlyFee;
      const possibleSave = list.reduce((sum, s) => sum + s.monthlyFee, 0) - cheapest;
      result.push({ category: cat, subscriptions: list, possibleSave });
    }
  }
  return result;
}

/** 거의 안 쓰는 구독 탐지 */
export function selectRarelyUsed(subs: Subscription[]): Subscription[] {
  return subs.filter((s) => s.usageFrequency === 'rarely');
}

// ─── Context ───────────────────────────────────────────────────────────────────

interface ContextValue {
  state: SubscriptionState;
  dispatch: React.Dispatch<Action>;
}

const SubscriptionContext = createContext<ContextValue | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitialState);
  return createElement(SubscriptionContext.Provider, { value: { state, dispatch } }, children);
}

export function useSubscriptions() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscriptions must be used inside SubscriptionProvider');
  return ctx;
}
