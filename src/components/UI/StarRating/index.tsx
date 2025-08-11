import styles from './styles.module.scss';

interface IStarsProps {
  rating: number;
}

const StarRating = (props: IStarsProps) => {
  const clampedRating = Math.max(0, Math.min(5, props.rating));
  const percentage = (clampedRating / 5) * 100;

  return (
    <div className={styles.starRating} data-testid={'star-rating-id'}>
      <span className={styles.emptyStar} data-testid={'star-empty-id'}>
        ★
      </span>
      <span
        data-testid={'star-full-id'}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${percentage}%`,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          color: 'gold',
        }}>
        ★
      </span>
    </div>
  );
};

export default StarRating;
