import styles from "./NotificationsDropdown.module.scss";
import { NotificationMessage } from "@/hooks/WebSocket";
import { useContext, useEffect, useState } from "react";
import { NotificationApi } from "@/features/dashboard/services/Notification/notification.service.ts";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { GreenNotificationIcon } from "@/assets/icons/shared.vectors.tsx";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotificationsDropdown = ({
  messages,
}: {
  messages: NotificationMessage[];
}) => {
  const { auth } = useContext(AuthContext);
  const { i18n } = useTranslation();
  const [data, setData] = useState<any>([]);
  const user_id = auth.user?.id;
  const { setLoader } = useContext(LoaderContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoader(true);

        const response = await NotificationApi(user_id);
        if (response?.status === 200) {
          setData(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoader(false);
      }
    };

    if (user_id) {
      fetchData();
    }
  }, [user_id]);

  return (
    <div className={styles.dropdown}>
      <div className={styles.title}>
        <h4>Notifications</h4>
        <Link to={`/${i18n.language}/notification`}>See all notifications</Link>
      </div>
      {messages.map((item, index) => (
        <div key={index} className={item.read ? styles.passive : styles.item}>
          <div className={styles.icon}>
            <GreenNotificationIcon />
          </div>
          <div>
            <h1>{item.message}</h1>
            <div className={styles.role}>
              <span>{item.sender_name}</span>
              <span>{item.date}</span>
              <p>({item.sender_role})</p>
            </div>
          </div>
        </div>
      ))}
      {Array.isArray(data) &&
        data.map((i: any, n: number) => (
          <div key={n} className={i.read ? styles.passive : styles.item}>
            <div className={styles.icon}>
              <GreenNotificationIcon />
            </div>
            <div>
              <h1>{i.message}</h1>
              <div className={styles.role}>
                <span>{i.sender_name}</span>
                <span>{i.date}</span>
                <p>({i.sender_role})</p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default NotificationsDropdown;
