import { useState } from "react";
import { styles } from "../assets/dummyStyles";
import NavBar from "./NavBar";
import Sidebar from "./Sidebar";

const Layout = ({ onLogout, user, setUser }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <div className={styles.layout.root}>
      <NavBar user={user} setUser={setUser} onLogout={onLogout} />
      <Sidebar
        user={user}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />
    </div>
  );
};

export default Layout;
