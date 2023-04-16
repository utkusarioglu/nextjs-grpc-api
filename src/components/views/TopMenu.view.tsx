"use client";
import { type FC } from "react";
import { MegaMenu } from "primereact/megamenu";
import { InputText } from "primereact/inputtext";
import { useResizeListener } from "primereact/hooks";
import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import SidebarProvider from "_providers/Sidebar.provider";

function useViewportSize() {
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
interface TopMenuProps {
  title: string;
}

const TopMenu: FC<TopMenuProps> = ({ title }) => {
  return <MegaMenu start={<span>{title}</span>} end={<SearchView />} />;
};

const COMPACT_SEARCH_MIN_WIDTH = 800;

const SearchView = () => {
  const { width } = useViewportSize();

  if (width < COMPACT_SEARCH_MIN_WIDTH) {
    return (
      <SidebarProvider
        sidebarPosition="right"
        sidebarContentComponent={() => <span>search</span>}
        childContentComponent={({ setVisible }) => (
          <Button label="S" onClick={() => setVisible(true)} />
        )}
      />
    );
  }

  return <InputText placeholder="Search" type="text" />;
};

export default TopMenu;
