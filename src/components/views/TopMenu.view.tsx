"use client";
import { type FC } from "react";
import { MegaMenu } from "primereact/megamenu";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import SidebarProvider from "_providers/Sidebar.provider";
import { useRouter } from "next/navigation";
import { useViewportSize } from "_hooks/viewport-size";

interface TopMenuProps {
  title: string;
}

const TopMenu: FC<TopMenuProps> = ({ title }) => {
  const router = useRouter();
  return (
    <MegaMenu
      start={
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button label="Home" onClick={() => router.push("/")} />
          <span style={{ paddingLeft: "1em", paddingRight: "1em" }}>
            {title}
          </span>
        </div>
      }
      end={<SearchView />}
    />
  );
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
