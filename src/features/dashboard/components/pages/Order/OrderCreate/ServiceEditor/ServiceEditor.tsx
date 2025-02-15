import styles from "./ServiceEditor.module.scss";
import { useContext, useState } from "react";
import Tabs from "@/components/Tabs/Tabs.tsx";
import { OrderEditorProps } from "@/features/dashboard/models/order.model.ts";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import ServiceProvider from "@/features/dashboard/components/pages/Order/OrderCreate/ServiceEditor/ServiceProvider/ServiceProvider.tsx";
import ServiceRequester from "@/features/dashboard/components/pages/Order/OrderCreate/ServiceEditor/ServiceRequester/ServiceRequester.tsx";
import { ThemeContext } from "@/contexts/ThemeContext.tsx";

const ServiceEditor = ({
  order,
  setOrder,
  active,
}: { active: boolean } & OrderEditorProps) => {
  const { darkMode } = useContext(ThemeContext);
  const { auth } = useContext(AuthContext);
  const [tab, setTab] = useState(0);
  const tabs = [
    ...(!["buyer"].includes(auth?.role)
      ? [
          {
            name: "order.tabs.services.one",
            tabs: 0,
            onClick: () => setTab(0),
          },
        ]
      : []),
    {
      name: "order.tabs.services.two",
      tabs: 1,
      onClick: () => setTab(1),
    },
  ];

  return (
    <div
      className={`${styles.service__editor} ${active && styles.active} ${darkMode && styles.dark}`}
    >
      <div className={styles.tabs}>
        <Tabs tabs={tabs} active={tab} />
      </div>

      <div className={styles.content}>
        {tab === 0 && <ServiceProvider order={order} setOrder={setOrder} />}
        {tab === 1 && <ServiceRequester />}
      </div>
    </div>
  );
};

export default ServiceEditor;
