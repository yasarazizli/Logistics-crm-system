import { useContext, useEffect, useState } from "react";

import styles from "./ClientEditor.module.scss";
import Input from "@/components/Input/Input.tsx";
import Button from "@/components/Button/Button.tsx";
import { getAllUsersRequest } from "@/features/dashboard/services/user.service.ts";
import { UserModel } from "@/features/dashboard/models/dashboard.model.ts";
import { OrderEditorProps } from "@/features/dashboard/models/order.model.ts";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import Result from "@/features/dashboard/components/pages/Order/OrderCreate/ClientEditor/Result/Result.tsx";
import { ThemeContext } from "@/contexts/ThemeContext.tsx";
import { useTranslation } from "react-i18next";
import UserCard from "@/features/dashboard/components/pages/Order/OrderCreate/ClientEditor/UserCard/UserCard.tsx";

const ClientEditor = ({ order, setOrder }: OrderEditorProps) => {
  const { auth } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");

  const [users, setUsers] = useState<UserModel[] | null>([]);

  const search = async () => {
    const { status, data } = await getAllUsersRequest(
      1,
      10,
      "",
      "",
      searchText,
    );

    if (status === 200) setUsers(data.users);
  };

  useEffect(() => {
    if (searchText) search().catch(() => {});
  }, [searchText]);

  return (
    <div className={`${styles.client__editor} ${darkMode && styles.dark}`}>
      {/* User Secilmesi */}
      {auth.role !== "user" && (
        <div className={styles.client__editor__search}>
          {!order.user && (
            <Input
              label={t("order.client_editor.search.label")}
              placeholder={t("order.client_editor.search.placeholder")}
              value={searchText}
              onChange={(event) => {
                setSearchText(event.target.value);
              }}
            />
          )}

          {!order.user && searchText && (
            <div className={styles.result__box}>
              <div>
                <p className={styles.title}>
                  {users?.length
                    ? t("order.client_editor.search.result")
                    : t("order.client_editor.search.empty")}
                </p>

                <div className={styles.results}>
                  {users?.map((result, index) => (
                    <Result
                      key={`result_${index}`}
                      result={result}
                      setUser={(result: UserModel) => {
                        setOrder((prevState) => ({
                          ...prevState,
                          user_id: result.id,
                          user: result,
                        }));
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {order.id === null && order.user && (
            <Button
              text={t("order.client_editor.buttons.new_user")}
              viewType={"dark-green"}
              onClick={() => {
                setOrder((prevState) => ({
                  ...prevState,
                  user_id: null,
                  user: null,
                }));
              }}
            />
          )}
        </div>
      )}

      {order.user && <UserCard order={order} />}
    </div>
  );
};

export default ClientEditor;
