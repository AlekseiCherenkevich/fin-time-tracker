import { useGamification } from '../hooks';
import styles from './Gamification.module.css';

export function Gamification() {
  const { gamification } = useGamification();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.level}>
          <span className={styles.levelIcon}>⭐</span>
          <span className={styles.levelText}>Level {gamification.level}</span>
        </div>
        <div className={styles.streak}>
          <span className={styles.streakIcon}>🔥</span>
          <span className={styles.streakText}>{gamification.streak}</span>
        </div>
      </div>

      <div className={styles.points}>
        <div className={styles.pointsBar}>
          <div 
            className={styles.pointsFill}
            style={{ width: `${(gamification.totalPoints % 1000) / 10}%` }}
          />
        </div>
        <span className={styles.pointsText}>
          {gamification.totalPoints} XP
        </span>
      </div>

      <div className={styles.achievements}>
        <h3 className={styles.achievementsTitle}>Achievements</h3>
        <div className={styles.achievementsList}>
          {gamification.achievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`${styles.achievement} ${achievement.unlockedAt ? styles.unlocked : ''}`}
            >
              <span className={styles.achievementIcon}>{achievement.icon}</span>
              <div className={styles.achievementInfo}>
                <span className={styles.achievementName}>{achievement.name}</span>
                <div className={styles.achievementProgress}>
                  <div 
                    className={styles.achievementProgressFill}
                    style={{ width: `${Math.min(100, (achievement.current / achievement.requirement) * 100)}%` }}
                  />
                </div>
                <span className={styles.achievementCount}>
                  {achievement.current}/{achievement.requirement}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
