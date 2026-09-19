"use client";

import { useLayoutEffect } from "react";

export default function ResetHashOnReload() {
  useLayoutEffect(() => {
    const navigationEntry = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;

    if (navigationEntry?.type !== "reload") {
      return;
    }

    if (!window.location.hash) {
      return;
    }

    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}`,
    );

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  return null;
}
