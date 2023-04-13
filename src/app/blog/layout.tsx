import React from "react";
import TopMenu from "_views/TopMenu.view";
import PrimeReact from "primereact/api";

console.log({ PrimeReact });

export default function BlogLayout({
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
        <TopMenu />
      </div>
      <div>{children}</div>
    </div>
  );
}
