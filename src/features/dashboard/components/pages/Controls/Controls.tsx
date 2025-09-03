import styles from "./Controls.module.scss";
import {
  ArrowIcon,
  CityIcon,
  CountryIcon,
  HsIcon,
  PortIcon,
  ServiceIcon,
  StationIcon,
} from "@/assets/icons/shared.vectors.tsx";
import { useNavigate } from "react-router-dom";
import i18n from "@/locales/i18n.ts";

const Controls = () => {
  const navigate = useNavigate();
  const data = [
    {
      id: 1,
      title: "Country",
      icon: <CountryIcon />,
      path: "country",
    },
    {
      id: 2,
      title: "City",
      icon: <CityIcon />,
      path: "city",
    },
    {
      id: 3,
      title: "Station",
      icon: <StationIcon />,
      path: "station",
    },
    {
      id: 4,
      title: "Service",
      icon: <ServiceIcon />,
      path: "service",
    },
    {
      id: 5,
      title: "Port",
      icon: <PortIcon />,
      path: "port",
    },
    {
      id: 6,
      title: "HS Code",
      icon: <HsIcon />,
      path: "hscode",
    },
  ];

  return (
    <div className={styles.panel}>
      <h1>Control panel</h1>
      <div className={styles.controls}>
        {data.map((item) => (
          <div key={item.id} className={styles.box}>
            <div className={styles.title}>
              <div className={styles.icon}>{item.icon}</div>
              <h1>{item.title}</h1>
            </div>
            <div
              className={styles.button}
              onClick={() =>
                navigate(`/${i18n.language}/controls/${item.path}`)
              }
            >
              <div className={styles.icon__1}>
                <ArrowIcon />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Controls;
