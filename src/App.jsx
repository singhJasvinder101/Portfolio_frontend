import { useEffect, useRef, useState } from "react";
import Nav from "./compoents/Nav";
import PostPage from "./pages/Blog";
import HomePage from "./pages/Home";
import BlogListPage from "./pages/BlogList";
import { fetchBlogs } from "./api/blogs";
import { POSTS } from "./constants";

export default function App() {
  const [page, setPage] = useState("home"); // 'home' | 'blogList' | 'post'
  const [activeSlug, setActiveSlug] = useState(null);
  const pendingScrollRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [postsStatus, setPostsStatus] = useState("loading");
  const [postsError, setPostsError] = useState("");

  useEffect(() => {
    let ignore = false;

    fetchBlogs()
      .then((blogs) => {
        if (ignore) return;
        setPosts(blogs);
        setPostsStatus("ready");
        setPostsError("");
      })
      .catch((error) => {
        if (ignore) return;
        setPosts(POSTS);
        setPostsStatus("fallback");
        setPostsError(error.message);
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (page === "home" && pendingScrollRef.current) {
      const el = document.getElementById(pendingScrollRef.current);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      pendingScrollRef.current = null;
    } else if (page !== "home") {
      window.scrollTo(0, 0);
    }
  }, [page]);

  const goHomeSection = (id) => {
    if (page === "home") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      pendingScrollRef.current = id;
      setPage("home");
    }
  };
  const goHomeTop = () => {
    setPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goBlogList = () => setPage("blogList");
  const openPost = (slug) => {
    setActiveSlug(slug);
    setPage("post");
  };

  return (
    <div className="pf">
      <Nav goHomeSection={goHomeSection} goBlogList={goBlogList} goHomeTop={goHomeTop} />

      {page === "home" && (
        <HomePage
          posts={posts}
          postsStatus={postsStatus}
          onOpenPost={openPost}
          onViewAllPosts={goBlogList}
        />
      )}
      {page === "blogList" && (
        <BlogListPage
          posts={posts}
          postsStatus={postsStatus}
          postsError={postsError}
          onOpenPost={openPost}
          onBack={goHomeTop}
        />
      )}
      {page === "post" && (
        <PostPage slug={activeSlug} posts={posts} onBack={goBlogList} onBackHome={goHomeTop} />
      )}

      <footer>built with Go-brain &amp; late-night coffee · © 2026 jasvinder</footer>
    </div>
  );
}
