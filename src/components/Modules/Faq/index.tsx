'use client';

import { useState } from 'react';
import LinkCustom from '@components/UI/LinkCustom';
import { useTranslation } from '@hooks/useTranslation';
import styles from './styles.module.scss';

interface FaqQuestion {
  question: string;
  answer: string;
}

export default function Faq() {
  const { t } = useTranslation('faq');
  const [openIndex, setOpenIndex] = useState(0);
  const questions = t.questions as FaqQuestion[];

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <LinkCustom href="/eventHome" className={styles.backLink}>
          {t.backBtn}
        </LinkCustom>
        <header className={styles.header}>
          <p className={styles.eyebrow}>FoodSpot</p>
          <h1>{t.title}</h1>
        </header>
        <section className={styles.list}>
          {questions.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <article className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`} key={item.question}>
                <button
                  type="button"
                  className={styles.trigger}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}>
                  <span>{item.question}</span>
                  <span className={styles.chevron} aria-hidden>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && <p className={styles.answer}>{item.answer}</p>}
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}