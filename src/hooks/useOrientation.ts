import { useState, useEffect } from "react";

export type Orientation = "landscape" | "portrait";

export function useOrientation(): Orientation {
  const getOrientation = () =>
    window.matchMedia("(orientation: landscape)").matches
      ? "landscape"
      : "portrait";

  const [orientation, setOrientation] = useState<Orientation>(getOrientation);

  useEffect(() => {
    const mql = window.matchMedia("(orientation: landscape)");
    const handleChange = (e: MediaQueryListEvent) => {
      setOrientation(e.matches ? "landscape" : "portrait");
    };
    mql.addEventListener("change", handleChange);

    return () => {
      mql.removeEventListener("change", handleChange);
    };
  }, []);

  return orientation;
}
