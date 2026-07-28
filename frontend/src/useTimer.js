import { useCallback, useEffect, useRef, useState } from 'react';

const toMs = (expiresAt) => {
  if (!expiresAt) return 0;
  const target = new Date(expiresAt).getTime();
  return Number.isFinite(target) ? Math.max(target - Date.now(), 0) : 0;
};

const formatCountdown = (ms) => {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

/**
 * Counts down to session expiry. When the timer hits zero, invokes onExpire once
 * (auto-submit ballot or lock the session).
 */
export function useTimer(expiresAt, { onExpire, enabled = true } = {}) {
  const [remainingMs, setRemainingMs] = useState(() => toMs(expiresAt));
  const [isExpired, setIsExpired] = useState(() => toMs(expiresAt) === 0 && Boolean(expiresAt));
  const firedRef = useRef(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    firedRef.current = false;
    const initial = toMs(expiresAt);
    setRemainingMs(initial);
    setIsExpired(initial === 0 && Boolean(expiresAt));
  }, [expiresAt]);

  useEffect(() => {
    if (!enabled || !expiresAt) return undefined;

    const tick = () => {
      const next = toMs(expiresAt);
      setRemainingMs(next);

      if (next === 0 && !firedRef.current) {
        firedRef.current = true;
        setIsExpired(true);
        onExpireRef.current?.();
      }
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, [enabled, expiresAt]);

  const reset = useCallback((nextExpiresAt) => {
    firedRef.current = false;
    const next = toMs(nextExpiresAt);
    setRemainingMs(next);
    setIsExpired(next === 0 && Boolean(nextExpiresAt));
  }, []);

  return {
    remainingMs,
    isExpired,
    isLocked: isExpired,
    formatted: formatCountdown(remainingMs),
    reset,
  };
}

export default useTimer;
