"use client";
import { useEffect, useState } from "react";
import { type Post } from "_types/json-placeholder.types";

const TIMEOUT_LATENCY = 2000;

interface PostsFetch {
  posts: Post[];
  timestamp: number; // epoch
}

type UsePostsReturn = PostsFetch & {
  isLoaded: boolean;
};

export function usePosts(): UsePostsReturn {
  const [fetchResponse, setFetchResponse] = useState<PostsFetch>({
    posts: [],
    timestamp: 0,
  });

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((posts) => {
        const assigner = () =>
          setFetchResponse({
            posts,
            timestamp: Date.now(),
          });
        const timeout = setTimeout(assigner, TIMEOUT_LATENCY);
        return () => clearTimeout(timeout);
      });
  }, []);

  return { ...fetchResponse, isLoaded: fetchResponse.timestamp !== 0 };
}
