import React from "react";
import TopMenu from "_views/TopMenu.view";
import PrimeReact from "primereact/api";

export default function InflationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        style={{
          position: "sticky",
          top: 0,
          padding: "1em",
          zIndex: PrimeReact.zIndex?.menu! + 1,
          borderRadius: 0,
        }}
      >
        <TopMenu title="Inflation" />
      </div>
      <div>{children}</div>
    </div>
  );
}
