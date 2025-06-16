// hooks/usePlanoExecucao.js
import { useState, useEffect, useRef } from 'react';

export const usePlanoExecucao = (initialBehaviors) => {
  const [behaviorQueue, setBehaviorQueue] = useState(initialBehaviors);
  const [currentBehaviorIndex, setCurrentBehaviorIndex] = useState(0);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [currentTryIndex, setCurrentTryIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const resetTimer = () => setElapsedTime(0);

  const getCurrent = () => {
    const behavior = behaviorQueue[currentBehaviorIndex];
    const activity = behavior?.activities?.[currentActivityIndex];
    const tryData = activity?.tries?.[currentTryIndex];
    return { behavior, activity, tryData };
  };

  return {
    behaviorQueue,
    setBehaviorQueue,
    currentBehaviorIndex,
    currentActivityIndex,
    currentTryIndex,
    setCurrentBehaviorIndex,
    setCurrentActivityIndex,
    setCurrentTryIndex,
    elapsedTime,
    startTimer,
    stopTimer,
    resetTimer,
    getCurrent,
  };
};
