import styles from "./layout.module.css";
import { useRouter } from "next/router";
import Link from "next/link";

const Layout = ({ children }) => {
  const router = useRouter();
  const isHome = router.asPath === "/";
  return (
    <div className={styles.container}>
      {!isHome && <Link href="/">Go Home</Link>}
      {children}
    </div>
  );
};

export default Layout;
