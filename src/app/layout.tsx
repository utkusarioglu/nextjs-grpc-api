// import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/themes/md-dark-deeppurple/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      style={{
        fontFamily: "var(--font-family)",
      }}
    >
      <head />
      <body style={{ margin: 0 }}>
        <div>{children}</div>
      </body>
    </html>
  );
}
