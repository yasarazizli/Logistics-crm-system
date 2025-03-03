import styles from "@/features/dashboard/components/pages/OrderEditor/OrderDetail/OrderDetail.module.scss";
import {
  OrderEditorProps,
  RouteEditorNameTypes,
  RouteModel,
  TransportEditorNameTypes,
} from "@/features/dashboard/models/order.model.ts";
import SelectOption from "@/components/New/SelectOption/SelectOption.tsx";
import {
  expeditors,
  ownerTransportTypes,
  sizeTypes,
  transitTypes,
  transportTypes,
  truckTypes,
  wagonTypes,
  weightTypes,
} from "@/features/dashboard/constants/order.constant.tsx";
import Input from "@/components/Input/Input.tsx";
import { useContext, useRef } from "react";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import TextArea from "@/components/TextArea/TextArea.tsx";
import {
  DeleteRouteIcon,
  LocationDownArrowIcon,
  LocationUpArrowIcon,
  RouteIcon,
} from "@/assets/icons/order.vectors.tsx";
import { DeleteOrderIcon } from "@/assets/images/layout/dashboard.vector.tsx";
import {
  Roles,
  Transport,
} from "@/features/dashboard/constants/enum.constant.tsx";
import SectionHead from "@/components/SectionHead/SectionHead.tsx";
import DimensionBox
  from "@/features/dashboard/components/pages/OrderEditor/OrderDetail/OrderRoutes/Route/DimensionBox/DimensionBox.tsx";
import RouteLocation
  from "@/features/dashboard/components/pages/OrderEditor/OrderDetail/OrderRoutes/RouteLocation/RouteLocation.tsx";

const RouteSection = ({
  order,
  setOrder,
  route,
  index,
}: OrderEditorProps & { index: number; route: RouteModel }) => {
  const { auth } = useContext(AuthContext);

  const routeEditor = (
    value: string | number | undefined,
    index: number,
    name: RouteEditorNameTypes,
  ) => {
    setOrder((prevState) => {
      const updatedRoutes = [...prevState.orderDetail.routes];
      updatedRoutes[index] = {
        ...updatedRoutes[index],
        [name]: value,
      };

      return {
        ...prevState,
        orderDetail: {
          ...prevState.orderDetail,
          routes: updatedRoutes,
        },
      };
    });
  };

  const transportEditor = (
    value: string | number | undefined,
    index: number,
    name: TransportEditorNameTypes,
  ) => {
    setOrder((prevState) => {
      const updatedRoutes = [...prevState.orderDetail.routes];
      const updatedTransport = { ...updatedRoutes[index].transport };

      //@ts-ignore
      updatedTransport[name] = value || "";

      updatedRoutes[index] = {
        ...updatedRoutes[index],
        transport: { ...updatedTransport },
      };

      return {
        ...prevState,
        orderDetail: {
          ...prevState.orderDetail,
          routes: updatedRoutes,
        },
      };
    });
  };

  // Codes
  const codesInputRef = useRef<HTMLInputElement | null>(null);

  const saveRouteCodes = (value: string) => {
    const rows = value.split("\n").map((row) => row.split("\t"));
    const newCodes = rows.map((row) => row.join(",")).join(",");

    setOrder((prevState) => {
      const updatedRoutes = [...prevState.orderDetail.routes];
      const updatedTransport = { ...updatedRoutes[index].transport };

      const existingCodes = updatedTransport.codes.split(",").filter(Boolean);

      const uniqueCodes = newCodes
        .split(",")
        .filter((code) => !existingCodes.includes(code));

      if (uniqueCodes.length === 0) {
        return prevState; // Eğer eklenebilecek yeni kod yoksa state'i değiştirme
      }

      updatedTransport.codes += `${uniqueCodes.join(",")},`;

      updatedRoutes[index] = {
        ...updatedRoutes[index],
        transport: {
          ...updatedTransport,
        },
      };

      console.log("create-transport-routes", updatedRoutes);

      return {
        ...prevState,
        orderDetail: {
          ...prevState.orderDetail,
          routes: updatedRoutes,
        },
      };
    });
  };

  return (
    <div className={styles.section}>
      {/* Route Head */}
      <div className={`${styles.flex} ${styles.between}`}>
        <SectionHead size={"m"} icon={RouteIcon} name={`Route ${index}`} />

        <div className={`${styles.flex} ${styles.align_center}`}>
          <div
            onClick={() => {
              setOrder((prevState) => {
                const routes = [...prevState.orderDetail.routes];
                if (index >= 1 && index < routes.length - 1) {
                  [routes[index], routes[index + 1]] = [
                    routes[index + 1],
                    routes[index],
                  ];
                }

                // Priority değerlerini güncelle
                if (route.priority > 1) {
                  routes.forEach((route, idx) => {
                    route.priority = idx + 1;
                  });
                }

                return {
                  ...prevState,
                  orderDetail: {
                    ...prevState.orderDetail,
                    routes: routes,
                  },
                };
              });
            }}
          >
            <LocationDownArrowIcon />
          </div>

          <div
            onClick={() => {
              setOrder((prevState) => {
                const routes = [...prevState.orderDetail.routes];

                if (index > 0) {
                  [routes[index], routes[index - 1]] = [
                    routes[index - 1],
                    routes[index],
                  ];
                }
                if (route.priority > 2) {
                  routes.forEach((route, idx) => {
                    route.priority = idx - 1;
                  });
                }

                return {
                  ...prevState,
                  orderDetail: {
                    ...prevState.orderDetail,
                    routes: routes,
                  },
                };
              });
            }}
          >
            <LocationUpArrowIcon />
          </div>

          <div
            onClick={() => {
              setOrder((prevState) => {
                const { routes } = prevState.orderDetail;
                const { deleted } = prevState;

                const updatedRoutes = routes.filter(
                  (_, indexOldRoutes) => indexOldRoutes !== index,
                );

                const updatedDeletedRoutes =
                  route.id !== null
                    ? [...(deleted.routes || []), Number(route.id)]
                    : deleted.routes;

                return {
                  ...prevState,
                  orderDetail: {
                    ...prevState.orderDetail,
                    routes: updatedRoutes,
                  },
                  deleted: {
                    ...deleted,
                    routes: updatedDeletedRoutes,
                  },
                };
              });
            }}
          >
            <DeleteRouteIcon />
          </div>
        </div>
      </div>

      {/* Route Locations & Details */}
      <div className={`${styles.grid} ${styles.four}`}>
        <RouteLocation
          label={"Loading place"}
          route={route}
          value={""}
          position={"start"}
          setLocation={(value: string, name: RouteEditorNameTypes) => {
            routeEditor(value, index, name);
          }}
        />
        <RouteLocation
          label={"Discharging place"}
          route={route}
          value={""}
          position={"end"}
          setLocation={(value: string, name: RouteEditorNameTypes) => {
            routeEditor(value, index, name);
          }}
        />
        <SelectOption
          label={"Transport Type"}
          value={transportTypes.find(
            (transportType) =>
              transportType.value === order.orderDetail.routes[index].type,
          )}
          options={transportTypes}
          onChange={(option) => {
            routeEditor("", index, "pad_code");
            routeEditor(option.value, index, "type");
          }}
        />

        <SelectOption
          label={"Transit Type"}
          value={transitTypes.find(
            (transitType) => transitType.value === route.transit,
          )}
          options={transitTypes}
          onChange={(option) => {
            routeEditor(option.value, index, "transit");
          }}
        />
      </div>

      <div
        className={`${
          [Transport.railway].includes(route.type as Transport)
            ? styles.four
            : styles.grid
        }`}
      >
        {[Transport.railway].includes(route.type as Transport) && (
          <Input
            label={"Padcode"}
            disabled={order.status !== "PadCodeIsExpected"}
            placeholder={"padcode"}
            value={route.pad_code || ""}
            onChange={(event) => {
              routeEditor(event.target.value, index, "pad_code");
            }}
          />
        )}

        {[Transport.railway].includes(route.type as Transport) && (
          <SelectOption
            label={"Expeditor"}
            disabled={order.status !== "PadCodeIsExpected"}
            options={expeditors}
            value={
              expeditors.filter(
                (expeditor) =>
                  expeditor.value === order.orderDetail.routes[index].expeditor,
              )[0]
            }
            onChange={(option) => {
              routeEditor(option.value, index, "expeditor");
            }}
          />
        )}

        <Input
          label={"Giriş"}
          placeholder={"Girish"}
          value={route.border_crossing_points_entry || ""}
          onChange={(event) => {
            routeEditor(
              event.target.value,
              index,
              "border_crossing_points_entry",
            );
          }}
        />

        <Input
          label={"Çıxış"}
          placeholder={"Cixsih"}
          value={route.border_crossing_points_exit || ""}
          onChange={(event) => {
            routeEditor(
              event.target.value,
              index,
              "border_crossing_points_exit",
            );
          }}
        />
      </div>

      {/* ---------------- Route Type ---------------- */}
      {/* Railway */}
      {route.type === Transport.railway && (
        <>
          <div className={`${styles.grid}`}>
            <SelectOption
              label={"Railway Type"}
              options={wagonTypes}
              value={wagonTypes.find(
                (wagonType) => wagonType.value === route.transport?.type,
              )}
              onChange={(option) => {
                transportEditor(option.value, index, "type");
              }}
            />

            <Input
              label={"Quantity"}
              placeholder={"Quantity"}
              value={route.transport?.count || ""}
              onChange={(event) => {
                transportEditor(event.target.value, index, "count");
              }}
            />
          </div>

          <div
            className={`${styles.grid} ${route.transport?.type === "fitting_wagon" && styles.three}`}
          >
            {route.transport?.type === "fitting_wagon" && (
              <SelectOption
                label={"Container Size"}
                value={sizeTypes.find(
                  (sizeType) => sizeType.value === route.transport?.type,
                )}
                options={sizeTypes}
                onChange={(option) => {
                  transportEditor(option.value, index, "size");
                }}
              />
            )}

            <SelectOption
              label={"Wagon Owner"}
              value={ownerTransportTypes.find(
                (ownerTransportType) =>
                  ownerTransportType.value === route.transport?.owner,
              )}
              options={ownerTransportTypes}
              onChange={(option) => {
                transportEditor(option.value, index, "owner");
              }}
            />

            {["admin", "commercial_manager"].includes(auth.role) && (
              <Input
                label={"Wagon №"}
                placeholder={"№"}
                inputRef={codesInputRef}
                onKeyDown={(event) => {
                  if (event.key === "Enter")
                    saveRouteCodes(String(codesInputRef.current?.value));
                }}
              />
            )}
          </div>

          {route.transport?.type !== "fitting_wagon" && (
            <div className={`${styles.grid} ${styles.three}`}>
              <DimensionBox
                label={"Size"}
                dimensions={route.transport}
                setDimension={(value, name) => {
                  transportEditor(value, index, name);
                }}
              />
              <SelectOption
                label={"Weight type"}
                value={weightTypes.find(
                  (weightType) => weightType.value === route.transport?.type,
                )}
                options={weightTypes}
                onChange={(option) => {
                  transportEditor(option.value, index, "volume_type");
                }}
              />
              <Input
                label={"Total weight"}
                placeholder={"Total weight"}
                value={route.transport?.volume_value || ""}
                type={"number"}
                onChange={(event) => {
                  transportEditor(event.target.value, index, "volume_value");
                }}
              />
            </div>
          )}
        </>
      )}

      {/* Truck */}
      {route.type === Transport.truck && (
        <>
          <div className={`${styles.grid}`}>
            <SelectOption
              label={"Truck Type"}
              options={truckTypes}
              value={truckTypes.find(
                (truckType) => truckType.value === route.transport?.type,
              )}
              onChange={(option) => {
                transportEditor(option.value, index, "type");
              }}
            />
            <Input
              label={"Quantity"}
              placeholder={"Quantity"}
              value={route.transport?.count || ""}
              onChange={(event) => {
                transportEditor(event.target.value, index, "count");
              }}
            />
          </div>

          <div
            className={`${styles.grid} ${route.transport?.type === "flatbed_truck" && styles.three}`}
          >
            {route.transport?.type === "flatbed_truck" && (
              <SelectOption
                label={"Container Size"}
                options={sizeTypes}
                value={sizeTypes.find(
                  (sizeType) =>
                    sizeType.value === String(route.transport?.size),
                )}
                onChange={(option) => {
                  transportEditor(option.value, index, "size");
                }}
              />
            )}
            <SelectOption
              label={"Truck Owner"}
              options={ownerTransportTypes}
              value={ownerTransportTypes.find(
                (ownerType) => ownerType.value === route.transport?.owner,
              )}
              onChange={(option) => {
                transportEditor(option.value, index, "owner");
              }}
            />

            {["admin", "commercial_manager"].includes(auth.role) && (
              <Input
                type="text"
                label={"Tranport №"}
                placeholder={"№"}
                inputRef={codesInputRef}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    saveRouteCodes(String(codesInputRef.current?.value));
                  }
                }}
              />
            )}
          </div>
        </>
      )}

      {/* Filder */}
      {route.type === Transport.filder && (
        <div className={`${styles.grid}`}>
          <Input
            label={"Quantity"}
            placeholder={"Quantity"}
            value={route.transport?.count || ""}
            onChange={(event) => {
              transportEditor(event.target.value, index, "count");
            }}
          />

          {[Roles.admin, Roles.commercial_manager].includes(
            auth.role as Roles,
          ) && (
            <Input
              type="text"
              label={"Container №"}
              placeholder={"№"}
              inputRef={codesInputRef}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  saveRouteCodes(String(codesInputRef.current?.value));
                }
              }}
            />
          )}
        </div>
      )}

      {/* Wagon And Container Cods */}
      {[Transport.truck, Transport.railway, Transport.filder].includes(
        route.type as Transport,
      ) && (
        <div className={`${styles.grid} ${styles.three}`}>
          {order.orderDetail.routes[index].transport?.codes
            .split(",")
            .map((code, indexCode) => {
              if (code !== "") {
                return (
                  <div
                    key={indexCode}
                    style={{
                      width: "100%",
                      height: "52px",
                      padding: "16px",
                      color: "#ffffff",
                      border: "1px dashed #292929",
                      background: "#181818",
                      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                      borderRadius: "6px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>{code}</span>
                    <div
                      onClick={() => {
                        setOrder((prevState) => {
                          const updatedRoutes = [
                            ...prevState.orderDetail.routes,
                          ];

                          const updatedTransport = {
                            ...updatedRoutes[index].transport,
                          };

                          // Kodları al ve boş stringleri temizle
                          console.log(updatedTransport.codes);
                          const codesArray = updatedTransport.codes
                            ? updatedTransport.codes
                                .split(",")
                                .map((c) => c.trim())
                                .filter(Boolean)
                            : [];

                          // Kodu listeden sil
                          const updatedCodes = codesArray.filter(
                            (c) => c !== code.trim(),
                          );

                          // Güncellenmiş kodları ayarla
                          updatedTransport.codes =
                            updatedCodes.length > 0
                              ? updatedCodes.join(",")
                              : "";

                          updatedRoutes[index] = {
                            ...updatedRoutes[index],
                            transport: updatedTransport,
                          };

                          return {
                            ...prevState,
                            orderDetail: {
                              ...prevState.orderDetail,
                              routes: updatedRoutes,
                            },
                          };
                        });
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <DeleteOrderIcon />
                    </div>
                  </div>
                );
              }
            })}
        </div>
      )}

      <TextArea
        label={`Route Qeyd`}
        placeholder={`Route Qeyd`}
        value={route.note || ""}
        onChange={(event) => {
          routeEditor(event.target.value, index, "note");
        }}
      />
    </div>
  );
};

export default RouteSection;
