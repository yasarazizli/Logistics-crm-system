import styles from "../../RouteEditor.module.scss";
import {
  OrderEditorProps,
  PackageEditorNameTypes,
} from "@/features/dashboard/models/order.model.ts";
import Input from "@/components/Input/Input.tsx";
import Button from "@/components/Button/Button.tsx";
import SelectOption from "@/components/SelectOption/SelectOption.tsx";
import {
  defaultPackingValue,
  ownerTransportTypes,
  packingTypes,
  weightTypes,
} from "@/features/dashboard/constants/order.constant.tsx";
import { useContext, useEffect, useState } from "react";
import { ModalType } from "@/features/dashboard/models/shared.model.ts";
import { DataContext } from "@/contexts/DataContext.tsx";
import DimensionBox from "@/features/dashboard/components/pages/Order/OrderCreate/RouteEditor/Route/DimensionBox/DimensionBox.tsx";
import HsCodeCreate from "@/features/dashboard/components/shared/Modals/Order/HsCodeCreate.tsx";
import SectionHead from "@/features/dashboard/components/pages/Order/OrderCreate/RouteEditor/SectionHead/SectionHead.tsx";
import { HsCodeModel } from "@/models/station.model.ts";
import {
  AddIcon,
  CargoIcon,
  DeleteRouteIcon,
} from "@/assets/icons/order.vectors.tsx";
import { ThemeContext } from "@/contexts/ThemeContext.tsx";

const PackingSection = ({
  order,
  setOrder,
  routeIndex,
}: OrderEditorProps & {
  routeIndex: number;
}) => {
  const { store, getData } = useContext(DataContext);
  const { darkMode } = useContext(ThemeContext);

  const packageUpdater = (
    index: number,
    name: PackageEditorNameTypes,
    value: number | string,
  ) => {
    setOrder((prevState) => {
      const updatedRoutes = [...prevState.orderDetail.routes];
      const targetRoute = updatedRoutes[routeIndex];

      if (targetRoute) {
        const updatedPackingList = [...(targetRoute.packing || [])];
        const targetPacking = updatedPackingList[index];

        if (targetPacking) {
          updatedPackingList[index] = {
            ...targetPacking,
            [name]: value,
          };

          updatedRoutes[routeIndex] = {
            ...targetRoute,
            packing: updatedPackingList,
          };
        }
      }

      return {
        ...prevState,
        orderDetail: {
          ...prevState.orderDetail,
          routes: updatedRoutes,
        },
      };
    });
  };

  const hsUpdater = (packageIndex: number, value: HsCodeModel) => {
    setOrder((prevState) => {
      // Mevcut route'ları kopyalıyoruz
      const updatedRoutes = [...prevState.orderDetail.routes];

      // Belirli bir route'taki packing listesini kopyalıyoruz
      const updatedPackings = [...(updatedRoutes[routeIndex]?.packing || [])];

      // Belirli bir packing içindeki hs dizisini güncelliyoruz
      const updatedHs = [...(updatedPackings[packageIndex]?.hs || [])];

      // Yeni hs objesini ekliyoruz
      updatedHs.push(value);

      // Packing listesindeki ilgili elemanı güncelliyoruz
      updatedPackings[packageIndex] = {
        ...updatedPackings[packageIndex],
        hs: updatedHs,
      };

      // Routes listesindeki ilgili route'u güncelliyoruz
      updatedRoutes[routeIndex] = {
        ...updatedRoutes[routeIndex],
        packing: updatedPackings,
      };

      // Güncellenmiş state'i dönüyoruz
      return {
        ...prevState,
        orderDetail: {
          ...prevState.orderDetail,
          routes: updatedRoutes,
        },
      };
    });
  };

  const [modals, setModals] = useState<ModalType>({
    create: null,
  });

  const containerSelected =
    order.orderDetail.routes.filter(
      (i) =>
        i.transport?.type === "fitting_wagon" ||
        i.transport?.type === "flatbed_truck",
    ).length > 0;

  useEffect(() => {
    getData(["hsCode"], 0).catch(() => {});
  }, []);

  return (
    <div className={styles.packings__list}>
      {/* Packings List */}
      {order.orderDetail.routes[routeIndex].packing?.map(
        (packing, packingIndex) => (
          <div
            className={styles.packings__list__item}
            key={`route_packing_${packingIndex}`}
          >
            {/* Packings Header */}
            <div className={styles.packings__list__item__head}>
              <SectionHead
                size={"s"}
                icon={CargoIcon}
                name={`Route ${routeIndex} Packing ${packingIndex + 1}`}
              />
              <div
                onClick={() => {
                  setOrder((prevState) => {
                    const updatedRoutes = [...prevState.orderDetail.routes];

                    // Packing listesini filtrele
                    const updatedPacking = updatedRoutes[
                      routeIndex
                    ].packing?.filter(
                      (_, deletePackingIndex) =>
                        deletePackingIndex !== packingIndex,
                    );

                    // Packing'den silinen öğe
                    const deletedPackingItem =
                      updatedRoutes[routeIndex].packing?.[packingIndex];

                    // Eğer id mevcutsa, deleted.packing'e ekle
                    const updatedDeletedPacking = deletedPackingItem?.id
                      ? [
                          ...(prevState.deleted.packings || []),
                          Number(deletedPackingItem.id),
                        ]
                      : prevState.deleted.packings;

                    updatedRoutes[routeIndex] = {
                      ...updatedRoutes[routeIndex],
                      packing: updatedPacking,
                    };

                    return {
                      ...prevState,
                      orderDetail: {
                        ...prevState.orderDetail,
                        routes: updatedRoutes,
                      },
                      deleted: {
                        ...prevState.deleted,
                        packings: updatedDeletedPacking,
                      },
                    };
                  });
                }}
              >
                <DeleteRouteIcon />
              </div>
            </div>

            {/* Packings HS Code */}
            {packing.hs.map((hs, hIndex) => (
              <div
                className={styles.packings__list__item__hs}
                key={`hs_${hIndex}_${hIndex}`}
              >
                <p
                  style={darkMode ? { color: "#ffffff" } : { color: "#000000" }}
                >
                  {store?.hsCode?.map((code) => {
                    if (hs.id === code.id)
                      return `Hs code :${code.code} | Cargo name: ${code.cargo}`;
                  })}
                </p>
                <div
                  onClick={() => {
                    setOrder((prevState) => {
                      // Mevcut route'ları kopyalıyoruz
                      const updatedRoutes = [...prevState.orderDetail.routes];

                      // Silinen hs_code listesini güncelliyoruz
                      const packingHsCode = [
                        ...(prevState.deleted?.packing_hs_code || []),
                      ];

                      if (hs.id !== null) {
                        const existingPacking = packingHsCode.find(
                          (item) => item.packing_id === packing.id,
                        );

                        if (existingPacking) {
                          // Aynı packing_id varsa, hs dizisine yeni id'yi ekliyoruz
                          existingPacking.hs.push(hs.id);
                        } else {
                          // Aynı packing_id yoksa, yeni bir obje oluşturuyoruz
                          packingHsCode.push({
                            packing_id: packing.id,
                            hs: [hs.id],
                          });
                        }
                      }

                      // Belirli bir route'taki packing listesini kopyalıyoruz
                      const updatedPackings = [
                        ...(updatedRoutes[routeIndex]?.packing || []),
                      ];

                      // Belirli bir packing içindeki hs dizisini güncelliyoruz
                      const updatedHs = [
                        ...(updatedPackings[packingIndex]?.hs || []),
                      ].filter((item) => item.id !== hs.id); // hs'yi filtreliyoruz

                      updatedPackings[packingIndex] = {
                        ...updatedPackings[packingIndex],
                        hs: updatedHs,
                      };

                      updatedRoutes[routeIndex] = {
                        ...updatedRoutes[routeIndex],
                        packing: updatedPackings,
                      };

                      // Güncellenmiş state'i dönüyoruz
                      return {
                        ...prevState,
                        orderDetail: {
                          ...prevState.orderDetail,
                          routes: updatedRoutes,
                        },
                        deleted: {
                          ...prevState.deleted,
                          packing_hs_code: packingHsCode,
                        },
                      };
                    });
                  }}
                >
                  <DeleteRouteIcon />
                </div>
              </div>
            ))}

            {/* Packings Add HS Code */}
            <div>
              <Button
                text={"Add another HS code"}
                viewType={"dark-green"}
                onClick={() => {
                  setModals((prevState) => ({
                    ...prevState,
                    create: Number(packingIndex),
                  }));
                }}
              />
            </div>

            <div className={`${styles.grid}`}>
              <SelectOption
                label={"Packaging Type"}
                options={packingTypes}
                value={packing.type}
                onChange={(event) => {
                  packageUpdater(packingIndex, "type", event.target.value);
                }}
              />
              <Input
                label={"Quantity"}
                placeholder={"Quantity"}
                type={"number"}
                value={`${packing.count}`}
                onChange={(event) => {
                  packageUpdater(packingIndex, "count", event.target.value);
                }}
              />
            </div>

            <div
              className={`${styles.grid} ${containerSelected ? styles.three : styles.four}`}
            >
              {!containerSelected && (
                <DimensionBox
                  label={"Size"}
                  dimensions={packing}
                  setDimension={(value, name) => {
                    packageUpdater(packingIndex, name, value);
                  }}
                />
              )}
              <SelectOption
                label={"Weight type"}
                options={weightTypes}
                value={packing.weight_type}
                onChange={(event) => {
                  packageUpdater(
                    packingIndex,
                    "weight_type",
                    event.target.value,
                  );
                }}
              />
              <Input
                label={"Net weight"}
                placeholder={"Total weight"}
                value={`${packing.net_weight || ""}`}
                onChange={(event) => {
                  packageUpdater(
                    packingIndex,
                    "net_weight",
                    event.target.value,
                  );
                }}
              />
              <Input
                label={"Gross weight"}
                placeholder={"Total weight"}
                value={`${packing.gross_weight || ""}`}
                onChange={(event) => {
                  packageUpdater(
                    packingIndex,
                    "gross_weight",
                    event.target.value,
                  );
                }}
              />
            </div>

            {containerSelected && (
              <div className={`${styles.grid} ${styles.three}`}>
                <SelectOption
                  label={"Container owner"}
                  options={ownerTransportTypes}
                  value={packing.container_owner}
                  onChange={(event) => {
                    packageUpdater(
                      packingIndex,
                      "container_owner",
                      event.target.value,
                    );
                  }}
                />

                <Input
                  label={"Container count"}
                  placeholder={"0"}
                  type={"number"}
                  value={`${packing.container_count}`}
                  onChange={(event) => {
                    packageUpdater(
                      packingIndex,
                      "container_count",
                      event.target.value,
                    );
                  }}
                />
                <Input
                  label={"Container codes"}
                  placeholder={"Container codes"}
                  value={`${packing.container_codes || ""}`}
                  onChange={(event) => {
                    packageUpdater(
                      packingIndex,
                      "container_codes",
                      event.target.value,
                    );
                  }}
                />
              </div>
            )}
          </div>
        ),
      )}

      {/* Add Another Packing */}
      <div className={styles.add__packing}>
        <Button
          icon={AddIcon}
          text={"Add another route packing"}
          viewType={"dark-green"}
          onClick={() => {
            setOrder((prevState) => {
              const updatedRoutes = [...prevState.orderDetail.routes];
              const targetRoute = updatedRoutes[routeIndex];

              if (targetRoute) {
                const updatedPacking = [
                  ...(targetRoute.packing || []),
                  defaultPackingValue,
                ];
                updatedRoutes[routeIndex] = {
                  ...targetRoute,
                  packing: updatedPacking,
                };
              }

              return {
                ...prevState,
                orderDetail: {
                  ...prevState.orderDetail,
                  routes: updatedRoutes,
                },
              };
            });
          }}
        />
      </div>

      {/*Ad Another Hs Code*/}
      {typeof modals.create == "number" && (
        <HsCodeCreate
          submit={(code: HsCodeModel) => {
            setModals((prevState) => ({
              ...prevState,
              create: null,
            }));
            hsUpdater(modals.create || 0, code);
          }}
          modalClose={() => {
            setModals((prevState) => ({
              ...prevState,
              create: null,
            }));
          }}
        />
      )}
    </div>
  );
};

export default PackingSection;
