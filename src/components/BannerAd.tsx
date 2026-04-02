// 구독 싹쓸이 - 배너 광고 컴포넌트 (더미)
// TODO: 앱인토스 인앱 광고 SDK의 실제 배너 뷰로 교체

import React from 'react';

interface BannerAdProps {
  placementId: string;
}

export const BannerAd: React.FC<BannerAdProps> = ({ placementId }) => {
  return (
    <div className="banner-ad" data-placement={placementId}>
      <span className="banner-ad__label">광고</span>
      <span className="banner-ad__text">여기에 배너 광고가 표시됩니다</span>
    </div>
  );
};
