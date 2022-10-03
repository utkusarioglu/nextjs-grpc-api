import Head from "next/head";
import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../utils/posts";
import styles from "../../styles/utils.module.css";
import Date from "../../components/date";

const Post = ({ postData: { title, id, date, contentHtml } }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Layout>
        <h1 className={styles.title}>{title}</h1>
        <p>{id}</p>
        <Date dateString={date} />
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </Layout>
    </>
  );
};

export function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { id } }) {
  const postData = await getPostData(id);
  console.log("getStaticProps", postData)
  return {
    props: {
      postData,
    },
    revalidate: 60
  };
}
export default Post;
