import Link from "next/link";
import styles from "../styles/index.module.css";

export const Header = ({ title = "Default title", links }) => {
  return (
    <div>
      <h1>{title}</h1>
      <Link
        href="grpc"
        passHref
        onClick={() => console.log("click")}
        className={styles["nav-link"]}
      >
        gRPC
      </Link>
      {links.map(({ title, href }) => (
        <a
          href={href}
          key={href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles["nav-link"]}
        >
          {title}
        </a>
      ))}
    </div>
  );
};
