import styles from "./Tools.module.scss";
import {
  BlueAddIcon,
  RefreshIcon,
} from "@/assets/images/layout/dashboard.vector.tsx";

import MoreButton from "@/components/MoreButton/MoreButton.tsx";
import {
  EditIcon,
  InfoIcon,
  OrderApproveIcon,
  OrderRejectIcon,
} from "@/assets/icons/shared.vectors.tsx";
import { DeleteRouteIcon } from "@/assets/icons/order.vectors.tsx";

const Tools = ({
  isMore,
  icons,
}: {
  isMore: boolean;
  icons: {
    type: string;
    onClick?: () => void;
    text?: string;
  }[];
}) => {
  const getTextClassName = (type: string) => {
    return styles[`text-${type}`] || "";
  };

  return (
    <>
      {isMore && (
        <div className={styles.tools}>
          {icons &&
            icons.map((icon, index) => (
              <div key={index} className={styles.item} onClick={icon.onClick}>
                {icon.type === "edit" && <EditIcon />}
                {icon.type === "info" && <InfoIcon />}
                {icon.type === "add" && <BlueAddIcon />}
                {icon.type === "delete" && <DeleteRouteIcon />}
                {icon.type === "approve" && <OrderApproveIcon />}
                {icon.type === "reject" && <OrderRejectIcon />}
                {icon.type === "refresh" && <RefreshIcon />}
                {icon.text && (
                  <span
                    className={`${styles.item__title} ${getTextClassName(
                      icon.type,
                    )}`}
                  >
                    {icon.text}
                  </span>
                )}
              </div>
            ))}
        </div>
      )}

      {!isMore && (
        <div className={styles.tools}>
          <MoreButton>
            {icons &&
              icons.map((icon, index) => (
                <div key={index} className={styles.item} onClick={icon.onClick}>
                  {icon.type === "add" && <BlueAddIcon />}
                  {icon.type === "delete" && <DeleteRouteIcon />}
                  {icon.type === "refresh" && <RefreshIcon />}
                  {icon.text && (
                    <span
                      className={`${styles.item__title} ${getTextClassName(
                        icon.type,
                      )}`}
                    >
                      {icon.text}
                    </span>
                  )}
                </div>
              ))}
          </MoreButton>
        </div>
      )}
    </>
  );
};

export default Tools;
