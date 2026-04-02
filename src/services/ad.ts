// 구독 싹쓸이 - 인앱 광고 서비스 추상화
// 실제 SDK: 앱인토스 인앱 광고 2.0 (추후 교체)

/**
 * 보상형 광고를 노출한다.
 * @param placementId 광고 지면 ID (앱인토스 콘솔에서 발급)
 * @returns 광고를 끝까지 시청했으면 true, 취소/실패 시 false
 */
export async function showRewardAd(placementId: string): Promise<boolean> {
  // TODO: 앱인토스 인앱 광고 SDK 연동
  // 예시:
  //   const result = await AppintosAd.showRewardedAd(placementId);
  //   return result.rewarded;

  // 개발/데모용: 1.5초 딜레이 후 성공 반환
  console.log(`[Ad] showRewardAd: placementId=${placementId}`);
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 1500);
  });
}

/**
 * 전면 광고를 노출한다.
 * @param placementId 광고 지면 ID
 */
export async function showInterstitialAd(placementId: string): Promise<void> {
  // TODO: 앱인토스 인앱 광고 SDK 연동
  console.log(`[Ad] showInterstitialAd: placementId=${placementId}`);
  return new Promise((resolve) => setTimeout(resolve, 500));
}

/**
 * 배너 광고 렌더링 컴포넌트 ID를 반환한다.
 * 실제 SDK에서는 네이티브 뷰 또는 웹뷰 컴포넌트를 주입한다.
 * @param placementId 광고 지면 ID
 */
export function renderBannerAd(placementId: string): string {
  // TODO: 앱인토스 인앱 광고 SDK 배너 렌더링 연동
  // 예시: return AppintosAd.getBannerAdHtml(placementId);
  console.log(`[Ad] renderBannerAd: placementId=${placementId}`);
  return placementId; // 더미: placementId를 그대로 반환 (BannerAd 컴포넌트에서 사용)
}

// 광고 지면 ID 상수
export const AD_PLACEMENT = {
  REPORT_UNLOCK: 'subscription_report_unlock',  // 리포트 해금 보상형 광고
  DASHBOARD_BANNER: 'dashboard_bottom',          // 대시보드 하단 배너
  INSIGHTS_INTERSTITIAL: 'insights_interstitial', // 인사이트 전면 광고
} as const;
