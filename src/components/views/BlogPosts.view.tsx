"use client";
import { type FC } from "react";
import { usePosts } from "_hooks/json-placeholder";
import BlogPostCardView from "_views/BlogPostCard.view";
import { type ChildComponentProps } from "_providers/Sidebar.provider";

type BlogPostsViewProps = ChildComponentProps;

const BlogPostsView: FC<BlogPostsViewProps> = ({ setVisible }) => {
  const { posts, isLoaded } = usePosts();

  if (!isLoaded) {
    return <span>Still loading...</span>;
  }

  if (isLoaded && !posts.length) {
    return <span>No posts😔</span>;
  }

  return (
    <div>
      {posts.map((post, index) => (
        <BlogPostCardView
          {...post}
          key={post.id}
          index={index}
          setVisible={setVisible}
        />
      ))}
    </div>
  );
};

export default BlogPostsView;
