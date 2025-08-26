import { useContext, type FC } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../contexts/auth_context/AuthContext";
import styles from './TabsBar.module.css'

const tabOrder = ["bestsellers", "new", "recommended", "allBooks", "login"] as const;
type TabType = typeof tabOrder[number];

interface TabsBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabsBar: FC<TabsBarProps> = ({ activeTab, onTabChange }) => {
  const auth = useContext(AuthContext);

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <div className={styles.tab} onClick={() => onTabChange("bestsellers")}>
          Bestselleri
        </div>

        <div className={styles.tab} onClick={() => onTabChange("new")}>
          Novi naslovi
        </div>

        <div className={styles.tab} onClick={() => onTabChange("recommended")}>
          Ne sudi knjigu po koricama
        </div>

        <div
          className={styles.tab}
          onClick={() => onTabChange("allBooks")}
        >
          Pregledaj sve knjige
        </div>

        <Link
          to={auth?.user ? "/user" : "/login"}
          className={styles.tab}
          onClick={() => onTabChange("login")}
        >
          {auth?.user ? auth.user.username : "Login"}
        </Link>

        <span
          className={styles.glider}
          style={{
            transform: `translateX(${tabOrder.indexOf(activeTab) * 100}%)`,
          }}
        />
      </div>
    </div>
  );
};

export default TabsBar;
