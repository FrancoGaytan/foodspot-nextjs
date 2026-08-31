'use client';

import { useEffect } from 'react';

export default function ThemeInitializer() {
  useEffect(() => {
    document.documentElement.dataset.theme = localStorage.getItem('foodspot-theme') === 'dark' ? 'dark' : 'light';
  }, []);

  return null;
}