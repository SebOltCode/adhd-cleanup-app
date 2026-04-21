import { useCallback, useState } from "react";

export const useCelebration = () => {
  const [isCelebrating, setIsCelebrating] = useState(false);

  const triggerCelebration = useCallback(() => {
    setIsCelebrating(true);
    setTimeout(() => {
      setIsCelebrating(false);
    }, 1800);
  }, []);

  return { isCelebrating, triggerCelebration } as const;
};
