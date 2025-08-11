'use client';

import styles from './styles.module.scss';
import Button from '@components/micro/Button';
import { ButtonKind } from '@components/micro/Button';
import StepItem from './StepItem';
import { useTranslation } from '@hooks/useTranslation';
import { handleScrollToStart } from '@utils/clientUtilities';

export default function HomeInfo() {
  const { t } = useTranslation('eventHome');

  const itemStepsData = [
    {
      title: t.LogInTheApp.title,
      description: t.LogInTheApp.description,
      imagePath: '/images/icons/joinAppLogo.png',
    },
    {
      title: t.joinToABarbecue.title,
      description: t.joinToABarbecue.description,
      imagePath: '/images/icons/calendarLogo.png',
    },
    {
      title: t.letsEat.title,
      description: t.letsEat.description,
      imagePath: '/images/icons/chickenLeg.png',
    },
  ];

  return (
    <section className={styles.participationSteps}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t.participationStepsTitle}</h2>

        <ul className={styles.icons}>
          {itemStepsData.map((item, index) => (
            <StepItem key={`step-item-${index}`} title={item.title} description={item.description} imagePath={item.imagePath} />
          ))}
        </ul>

        <p>{t.participationStepsDescriptionPart2}</p>

        <div className={styles.participateButton}>
          <Button kind={ButtonKind.PRIMARY} size="large" onClick={handleScrollToStart}>
            {t.participateButton}
          </Button>
        </div>
      </div>
    </section>
  );
}
