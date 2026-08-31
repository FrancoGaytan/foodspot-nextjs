'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@hooks/useTranslation';
import styles from './styles.module.scss';
import SegmentedControl from '@components/UI/SegmentedControl';

type Theme = 'light' | 'dark';

export default function ThemeSelector() {
  const { t } = useTranslation('userProfile');
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('foodspot-theme');
    const nextTheme = savedTheme === 'dark' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  function changeTheme(nextTheme: Theme) {
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('foodspot-theme', nextTheme);
  }

  return (
    <div className={styles.languageField}>
      <span>{t.themeLabel}</span>
      <SegmentedControl
        ariaLabel={t.themeLabel}
        value={theme}
        onChange={value => changeTheme(value as Theme)}
        options={[
          { value: 'light', label: t.lightTheme, icon: <span className="material-icons">light_mode</span> },
          { value: 'dark', label: t.darkTheme, icon: <span className="material-icons">dark_mode</span> },
        ]}
      />
    </div>
  );
}