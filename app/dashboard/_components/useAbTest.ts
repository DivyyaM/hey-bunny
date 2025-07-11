import { useMemo } from 'react';

// Minimal placeholder for A/B test logic
const useAbTest = () => {
  // For now, always return group 'A'.
  const group = useMemo(() => 'A', []);
  return { group };
};

export default useAbTest; 