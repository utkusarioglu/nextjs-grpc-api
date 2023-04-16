"use client";
import SidebarProvider from "_providers/Sidebar.provider";
import BlogPostsView from "_views/BlogPosts.view";

const BlogPage = () => {
  return (
    <div>
      <SidebarProvider
        childContentComponent={BlogPostsView}
        sidebarContentComponent={() => <span>sidebar content</span>}
        sidebarPosition="bottom"
      />
    </div>
  );
};

export default BlogPage;
