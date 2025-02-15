import styles from "@/components/Notification/Notification.module.scss";
import { NotificationIcon } from "@/assets/icons/header.vectors.tsx";
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "@/contexts/ThemeContext.tsx";
import useClickOutside from "@/hooks/useClickOutside.ts";
import { Link } from "react-router-dom";
import { getAllNotificationRequest } from "@/features/dashboard/services/shared.service.ts";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error.ts";
import { useTranslation } from "react-i18next";

const Notification = () => {
  const { i18n, t } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  const boxRef = useRef<HTMLDivElement>(null);
  const clickedInside = useClickOutside(boxRef);

  const [active, setActive] = useState<boolean>(false);
  const [notification, setNotification] = useState<
    {
      title: {
        detail_en: string;
        detail_az: string;
        detail_ru: string;
      };
      description: string;
      path: string;
    }[]
  >([]);

  const getAllNotifications = async () => {
    const { status, data } = await getAllNotificationRequest();
    if (status === 200) setNotification(data);
    else toast.error(errorMessageHandler(data));
  };

  useEffect(() => {
    if (!clickedInside) setActive(false);
  }, [clickedInside]);

  useEffect(() => {
    getAllNotifications().catch(() => {});
  }, []);

  return (
    <div className={`${styles.notification} ${darkMode && styles.dark}`}>
      <div
        className={styles.notification__icon}
        onClick={() => {
          setActive((prevState) => !prevState);
        }}
      >
        <NotificationIcon />
      </div>

      <div
        ref={boxRef}
        className={`${styles.notification__content} ${active && styles.active}`}
      >
        {notification.length > 0 ? (
          notification?.map((notification, index) => (
            <div key={index} className={styles.notification__content__item}>
              <p className={styles.title}>
                {/* @ts-ignore */}
                {notification?.title[`detail_${i18n.language}`]}
              </p>
              <p className={styles.subtitle}>{notification?.description}</p>
              <Link to={notification.path} className={styles.redirect}>
                {t("shared.notification.redirect")}
              </Link>
              <span className={styles.delete}>X</span>
            </div>
          ))
        ) : (
          <div className={styles.notification__content__item}>
            <p className={styles.title}>{t("shared.notification.empty")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
