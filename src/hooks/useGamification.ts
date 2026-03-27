import { useApp } from '../contexts/AppContext';
import { useCallback } from 'react';

export function useGamification() {
  const { state, dispatch } = useApp();
  
  const updatePoints = useCallback((points: number) => {
    const newTotal = state.gamification.totalPoints + points;
    const newLevel = Math.floor(newTotal / 1000) + 1;
    dispatch({ type: 'UPDATE_GAMIFICATION', payload: { totalPoints: newTotal, level: newLevel }});
  }, [state.gamification.totalPoints, dispatch]);

  const updateStreak = useCallback(() => {
    dispatch({ type: 'UPDATE_GAMIFICATION', payload: { streak: state.gamification.streak + 1 }});
  }, [state.gamification.streak, dispatch]);

  const updateAchievement = useCallback((id: string, current: number) => {
    const achievements = state.gamification.achievements.map(a =>
      a.id === id ? { ...a, current, unlockedAt: current >= a.requirement ? new Date().toISOString() : undefined } : a
    );
    dispatch({ type: 'UPDATE_GAMIFICATION', payload: { achievements }});
  }, [state.gamification.achievements, dispatch]);

  return {
    gamification: state.gamification,
    updatePoints,
    updateStreak,
    updateAchievement
  };
}
