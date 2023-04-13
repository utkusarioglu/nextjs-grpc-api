"use client";
import { Sidebar } from "primereact/sidebar";
import {
  useState,
  type FC,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

type SetVisible = Dispatch<SetStateAction<boolean>>;

export type ChildComponentProps = {
  setVisible: SetVisible;
};

type BottomSidebarProviderProps = {
  sidebarPosition: "bottom" | "left" | "right";
  sidebarContentComponent: FC;
  childContentComponent: FC<ChildComponentProps>;
};

const SidebarProvider: FC<BottomSidebarProviderProps> = ({
  sidebarContentComponent: SidebarContent,
  childContentComponent: ChildContentComponent,
  sidebarPosition,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <ChildContentComponent setVisible={setVisible} />
      <Sidebar
        visible={visible}
        position={sidebarPosition}
        onHide={() => setVisible(false)}
      >
        <SidebarContent />
      </Sidebar>
    </div>
  );
};

export default SidebarProvider;
