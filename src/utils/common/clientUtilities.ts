'use client';

export function getBrowserName(): string {
  if (typeof window === 'undefined') return 'unknown';

  const agent = window.navigator.userAgent.toLowerCase();

  switch (true) {
    case agent.includes('edge'):
    case agent.includes('edg/'):
      return 'Edge';
    case agent.includes('trident'):
      return 'MS IE';
    case agent.includes('firefox'):
      return 'Mozilla Firefox';
    case agent.includes('safari'):
      return 'Safari';
    default:
      return 'other';
  }
}

export const handleScrollToStart = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};
