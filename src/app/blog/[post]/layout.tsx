import Link from "next/link";

const PostLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "1em" }}>
      <aside style={{ backgroundColor: "pink", padding: "1em" }}>
        <h2>aside stuff</h2>
        <ol>
          <li>one</li>
          <li>two</li>
        </ol>
      </aside>
      <article
        style={{
          backgroundColor: "pink",
          padding: "1em",
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {children}
        <Link href="/">Go home</Link>
      </article>
    </div>
  );
};

export default PostLayout;
