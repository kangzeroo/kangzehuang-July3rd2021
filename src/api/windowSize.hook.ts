import { useState, useEffect } from "react";

type TWindowDimensions = {
  width: number | undefined;
  height: number | undefined;
};
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<TWindowDimensions>({
    width: undefined,
    height: undefined,
  });
  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);
  const isMobile = (windowSize.width || 0) > 500 ? false : true;
  return { windowSize, isMobile };
}
