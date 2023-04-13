"use client";
import "client-only";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import { type Post } from "src/types/json-placeholder.types";

const POSTS_ENDPOINT = "https://jsonplaceholder.typicode.com/posts";

const fetcher = (
  ...args: [input: RequestInfo | URL, init?: RequestInit | undefined]
) =>
  fetch(...args)
    .then((res) => res.json())
    .then(
      (response) =>
        new Promise<Post>((resolve) =>
          setTimeout(() => {
            resolve(response);
          }, 2000)
        )
    );

const PostPage = () => {
  const pathname = usePathname();

  if (!pathname) {
    return <span>Error, pathname broken</span>;
  }

  const pathnameSplit = pathname.split("/");
  const postId = pathnameSplit[pathnameSplit.length - 1];

  if (Number.isNaN(postId)) {
    return <span>Error, postId is not a number {postId}</span>;
  }

  const { data, error, isLoading } = useSWR<Post>(
    `${POSTS_ENDPOINT}/${postId}`,
    fetcher
  );

  if (error) {
    return <span>Error, fetch error</span>;
  }

  if (isLoading) {
    return <span>Loading....</span>;
  }

  if (!data) {
    return <span>Error, data is bad bad</span>;
  }

  return (
    <div style={{ maxWidth: "30wv" }}>
      <h1>{pathname}</h1>
      <h3>{data.title}</h3>
      <p>{data.body}</p>
    </div>
  );
};

export default PostPage;
