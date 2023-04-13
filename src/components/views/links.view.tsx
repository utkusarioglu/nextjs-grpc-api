"use client";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";

const LinksView = () => {
  const router = useRouter();
  return (
    <>
      {["/blog", "/blog/hello"].map((item) => (
        <Button onClick={() => router.push(item)} link key={item}>
          {item}
        </Button>
      ))}
    </>
  );
};

export default LinksView;
