import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import styles from "./OrderServiceTable.module.scss";
import { OrderEditorProps } from "@/features/dashboard/models/order.model.ts";
import { DataContext } from "@/contexts/DataContext.tsx";
import {
  DeleteServiceIcon,
  DoneServiceIcon,
  EditServiceIcon,
} from "@/assets/icons/order.vectors.tsx";
import { ThemeContext } from "@/contexts/ThemeContext.tsx";

type OrderServiceTableProps = {
  edit: number | null;
  setEdit: React.Dispatch<React.SetStateAction<number | null>>;
} & OrderEditorProps;

const OrderServiceTable = ({
  edit,
  setEdit,
  order,
  setOrder,
}: OrderServiceTableProps) => {
  const { darkMode } = useContext(ThemeContext);
  const { store, getData } = useContext(DataContext);
  const [render, setRender] = useState(false);
  useEffect(() => {
    getData(["vendors"], 0).catch(() => {});
  }, []);

  const serviceEditor = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number,
    name: "count" | "selling_price" | "service_id" | "vendor_name",
  ) => {
    setOrder((prevState) => {
      const services = [...(prevState.orderDetail.services || [])];

      // @ts-ignore
      services[index][name] = Number(event.target.value.match(/\d+/g));

      if (name === "selling_price") {
        services[index][name] = String(event.target.value.match(/\d+/g));
      }

      if (name === "count") {
        services[index][name] = String(event.target.value.match(/\d+/g));
      }

      return { ...prevState, services };
    });
  };

  const [total, setTotal] = useState({
    buy: 0,
    sale: 0,
    profit: 0,
  });

  const removeService = (id: string) => {
    setOrder((prevState) => {
      const element = prevState.orderDetail.services?.find(
        (service) => service.key_id === id,
      );

      const services = prevState.orderDetail.services?.filter(
        (service) => service.key_id !== id,
      );

      return {
        ...prevState,
        orderDetail: {
          ...prevState.orderDetail,
          services: services,
        },
        deleted: {
          ...prevState.deleted,
          services: [...prevState.deleted.services, Number(element?.id)],
        },
      };
    });
  };

  const totalRow = () => {
    let buy = 0;
    let sale = 0;
    let profit = 0;

    order.orderDetail.services?.forEach((service) => {
      const count = Number(service.count) || 0;
      const buyPrice =
        Number(
          store.services?.find((s) => s.id === service.service_id)
            ?.selling_price,
        ) || 0;
      const salePrice = Number(service.selling_price) || 0;

      buy += buyPrice * count;
      sale += salePrice * count;
      profit += (salePrice - buyPrice) * count;
    });

    setTotal({ buy, sale, profit });
  };

  useEffect(() => {
    totalRow();
    getData(["services"]).catch(() => {});
  }, [order.orderDetail.services, render]);

  return (
    <div className={`${styles.table__box} ${darkMode && styles.dark}`}>
      <table className={styles.table}>
        <thead>
          <tr>
            <td></td>
            <td>Xərc adı</td>
            <td>Vender</td>
            <td>Miqdar</td>
            <td>Alış (1 kont)</td>
            <td>Alış</td>
            <td>Satış (1 kont)</td>
            <td>Satış</td>
            <td>Profit</td>
          </tr>
        </thead>
        <tbody>
          {order.orderDetail.services?.map((service, index) => {
            const selectedService =
              store.services &&
              store?.services?.find((i) => i.id === service.service_id);

            return (
              <tr
                className={`${edit === index && styles.active}`}
                key={`service_${service.key_id}`}
              >
                <td>
                  <div className={styles.buttons}>
                    {edit === index ? (
                      <>
                        <button
                          onClick={() => {
                            setEdit(null);
                            setRender((prevState) => !prevState);
                          }}
                        >
                          <DoneServiceIcon />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEdit(index);
                          }}
                        >
                          <EditServiceIcon />
                        </button>
                        <button
                          onClick={() => {
                            removeService(String(service.key_id));
                          }}
                        >
                          <DeleteServiceIcon />
                        </button>
                      </>
                    )}
                  </div>
                </td>

                <td>
                  <select
                    disabled={edit !== index}
                    value={service.service_id || ""}
                    onChange={(event) => {
                      serviceEditor(event, index, "service_id");
                    }}
                  >
                    <option value={""}>Xidmət seçin</option>
                    {store.services &&
                      store.services?.map((s, sIndex) => (
                        <option
                          key={`service_${index}_option_${sIndex}`}
                          value={s.id}
                        >
                          {s.name}
                        </option>
                      ))}
                  </select>
                </td>
                <td>
                  {(store?.services &&
                    store?.vendors?.find(
                      (i) => i.id === selectedService?.vendor.id,
                    )?.name) ||
                    "-"}
                </td>
                <td>
                  <input
                    value={Number(service.count)}
                    onChange={(event) => {
                      const value = Number(
                        event.target.value.match(/\d+/g)?.[0] || NaN,
                      );
                      if (isNaN(value)) event.target.value = "0";
                      serviceEditor(event, index, "count");
                    }}
                    disabled={edit !== index}
                  />
                </td>
                <td>{(selectedService?.selling_price || 0).toFixed(2)}</td>
                <td>
                  {(
                    (selectedService?.selling_price || 0) *
                    Number(service.count)
                  ).toFixed(2)}
                </td>
                <td>
                  <input
                    value={Number(service.selling_price)}
                    onChange={(event) => {
                      const value = Number(
                        event.target.value.match(/\d+/g)?.[0] || NaN,
                      );
                      if (isNaN(value)) event.target.value = "0";
                      serviceEditor(event, index, "selling_price");
                    }}
                    disabled={edit !== index}
                  />
                </td>
                <td>{Number(service.selling_price) * Number(service.count)}</td>
                <td>
                  {(
                    (Number(service.selling_price) -
                      (selectedService?.selling_price || 0)) *
                    Number(service.count)
                  ).toFixed(2)}
                </td>
              </tr>
            );
          })}

          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>{total.buy.toFixed(2)}</td>
            <td></td>
            <td>{total.sale.toFixed(2)}</td>
            <td>{total.profit.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OrderServiceTable;
