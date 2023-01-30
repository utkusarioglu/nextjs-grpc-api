import Link from "next/link";
import styles from "./PostCard.module.scss";

const PostCard = ({ post: { id, title, date, summary } }) => {
  return (
    <div>
      <Link href={`posts/${id}`} className={styles["a"]}>
        <div className={styles.container}>
          <h3>{title}</h3>
          <div>{date}</div>
          <div>{summary}</div>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;
