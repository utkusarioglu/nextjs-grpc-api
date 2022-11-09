import { useState } from "react";
import Layout from "../components/layout";
import { getSortedPostsData } from "../utils/posts";
import PostCard from "../components/PostCard";
import styles from "../styles/index.module.css";
import getConfig from "next/config";
import { Header } from "../components/Header";

const LINKS = [
  {
    title: "Grafana",
    subdomain: "grafana",
  },
  {
    title: "Jaeger",
    subdomain: "jaeger",
  },
  {
    title: "Prometheus",
    subdomain: "prometheus",
  },
  {
    title: "Vault",
    subdomain: "vault",
  },
];

export function getServerSideProps() {
  try {
    const allPostsData = getSortedPostsData();
    const {
      publicRuntimeConfig: { domainName, scheme },
    } = getConfig();
    return {
      props: {
        allPostsData,
        links: LINKS.map(({ title, subdomain }) => ({
          title,
          subdomain,
          href: `${scheme}://${subdomain}.${domainName}`,
        })),
      },
    };
  } catch (e) {
    console.log("error: ", e);
    return {
      props: {
        allPostsData: [],
        links: [],
      },
    };
  }
}

const IndexPage = ({ allPostsData, links }) => {
  const [likes, setLikes] = useState(0);

  function handleClick() {
    setLikes((likes) => ++likes);
  }

  return (
    <Layout>
      <Header title="Utku's rocket 🚀" links={links} />
      <div>
        <button onClick={handleClick}>Click counter ({likes})</button>
      </div>
      <ul className={styles["card-list"]}>
        {allPostsData.map((post) => (
          <li key={post.id}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default IndexPage;
