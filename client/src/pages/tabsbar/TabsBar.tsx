import { useContext, type FC } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../contexts/auth_context/AuthContext";
import styles from "./TabsBar.module.css";
import { LogOut } from "lucide-react";

const tabOrder = ["bestsellers", "new", "recommended", "allBooks", "login"] as const;
type TabType = typeof tabOrder[number];

interface TabsBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabsBar: FC<TabsBarProps> = ({ activeTab, onTabChange }) => {
  const auth = useContext(AuthContext);

  const handleLogout = () => {
    auth?.logout();
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <div className={styles.tab} onClick={() => onTabChange("bestsellers")}>
          Bestsellers
        </div>

        <div className={styles.tab} onClick={() => onTabChange("new")}>
          New Titles
        </div>

        <div className={styles.tab} onClick={() => onTabChange("recommended")}>
          Do Not Judge a Book by Its Cover
        </div>

        <div className={styles.tab} onClick={() => onTabChange("allBooks")}>
          Library
        </div>

        {!auth?.user ? (
          <Link
            to="/login"
            className={styles.tab}
            onClick={() => onTabChange("login")}
          >
            Login
          </Link>
        ) : (
          <div className={`${styles.tab} ${styles.userTab}`}>
            <Link
              to="/user"
              className={styles.username}
              onClick={() => onTabChange("login")}
            >
              {auth.user.username}
            </Link>
            <Link to="/home"
              onClick={handleLogout}
              className={styles.logoutBtn}
              title="Logout"
            >
              <LogOut size={20} />
            </Link>
          </div>
        )}

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
