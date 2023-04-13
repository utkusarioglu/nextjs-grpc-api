"use client";
import Link from "next/link";
import { type FC } from "react";
import { type Post } from "src/types/json-placeholder.types";
import { Card } from "primereact/card";
import { Image } from "primereact/image";
import { useRouter } from "next/navigation";
import { SplitButton } from "primereact/splitbutton";
import { Button } from "primereact/button";
import { type ChildComponentProps } from "_providers/Sidebar.provider";

const CARD_THUMB_WIDTH = 400;
const CARD_THUMB_HEIGHT = 300;
const DAY_EPOCH = 24 * 60 * 60 * 1000;

type BlogPostCardViewProps = Exclude<Post, "userId"> &
  ChildComponentProps & { index: number };

const BlogPostCardView: FC<BlogPostCardViewProps> = ({
  title,
  body,
  id,
  index,
  setVisible,
}) => {
  const router = useRouter();

  const thumbnailSrc = [
    "https://picsum.photos/seed",
    id + index,
    CARD_THUMB_WIDTH,
    CARD_THUMB_HEIGHT,
  ].join("/");

  const viewPost = () => router.push(`/blog/${id}`);

  return (
    <Card
      title={title}
      subTitle={new Date(Date.now() - index * DAY_EPOCH).toLocaleDateString()}
      style={{ marginBottom: "1em" }}
      header={() => (
        <Link href={`/blog/${id}`} style={{ lineHeight: 0 }}>
          <Image src={thumbnailSrc} />
        </Link>
      )}
      footer={() => (
        <div style={{ display: "flex", justifyContent: "right", gap: "0.5em" }}>
          <Button
            label="Share"
            icon="pi pi-send"
            onClick={() => setVisible(true)}
          />
          <SplitButton
            label="View"
            icon="pi pi-play"
            onClick={viewPost.bind(this)}
            model={[
              {
                label: "Read later",
                icon: "pi pi-bookmark",
                command: () => {},
              },
              {
                label: "Another thing",
                icon: "pi pi-refresh",
                command: () => {},
              },
            ]}
          />
        </div>
      )}
    >
      <p style={{ margin: 0 }}>{body}</p>
    </Card>
  );
};

export default BlogPostCardView;
