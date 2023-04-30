"use client";
import { useResizeListener } from "primereact/hooks";
import { useState, useEffect } from "react";

export function useViewportSize() {
  const [eventData, setEventData] = useState({ width: 0, height: 0 });

  const [bindWindowResizeListener, unbindWindowResizeListener] =
    useResizeListener({
      listener: (event) => {
        setEventData({
          // @ts-ignore
          width: event.currentTarget?.innerWidth || 0,
          // @ts-ignore
          height: event.currentTarget?.innerHeight || 0,
        });
      },
    });

  useEffect(() => {
    setEventData({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    bindWindowResizeListener();

    return () => {
      unbindWindowResizeListener();
    };
  }, [bindWindowResizeListener, unbindWindowResizeListener]);

  return eventData;
}
