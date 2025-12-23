import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import Language from "@/components/Language/Language.tsx";
import { CompanyIcon } from "@/assets/icons/shared.vectors.tsx";
import styles from "@/components/Header/Header.module.scss";
import { NotificationIcon } from "@/assets/icons/header.vectors.tsx";
import NotificationsDropdown from "@/components/NotificationsDropdown/NotificationsDropdown.tsx";
import { useWebSocket } from "@/hooks/WebSocket.ts";

const Header = () => {
  const { auth } = useContext(AuthContext);
  const [openNotifications, setOpenNotifications] = useState(false);

  const userId = auth.user?.id;

  const { messages, unreadCount, markAllAsRead } = useWebSocket(
    userId ? `ws://127.0.0.1:8080/ws?user_id=${userId}` : "",
  );

  const toggleNotifications = () => {
    setOpenNotifications((p) => !p);
    markAllAsRead();
  };

  return (
    <div className={styles.dashboard__header}>
      <div className={styles.buttons}>
        <div className={`${styles.button} ${styles.language}`}>
          <Language />
        </div>

        {auth.role === "" && (
          <div
            className={styles.notificationWrapper}
            onClick={toggleNotifications}
          >
            <NotificationIcon />

            {unreadCount > 0 && (
              <span className={styles.badge}>{unreadCount}</span>
            )}

            {openNotifications && <NotificationsDropdown messages={messages} />}
          </div>
        )}

        <div className={styles.special__button}>
          <CompanyIcon />
          <span>{auth.user?.full_name || "Müştəri"}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
