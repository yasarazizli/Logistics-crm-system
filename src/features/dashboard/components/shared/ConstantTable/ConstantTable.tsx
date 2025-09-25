// import { useState, useEffect } from "react";
// import styles from "../RowTable/RowTable.module.scss";
// import { DeleteIcon, SharedIcon } from "@/assets/icons/shared.vectors.tsx";
// import CreateServicesTable from "@/features/dashboard/components/shared/Modals/ServicesTable/CreateServicesTable.tsx";
//
// type Column = {
//   id: number;
//   data: Record<string, string>;
// };
//
// const staticRows = [
//   { name: "Name of Service", inputs: 1 },
//   { name: "Location", inputs: 1 },
//   { name: "Transport mode", inputs: 1 },
//   { name: "From", inputs: 1 },
//   { name: "To", inputs: 1 },
//   { name: "Transport type", inputs: 1 },
//   { name: "Packaging Type", inputs: 3 },
//   { name: "Net weight ton", inputs: 1 },
//   { name: "Gross weight ton", inputs: 1 },
//   { name: "Width (Meter)", inputs: 1 },
//   { name: "Length (Meter)", inputs: 1 },
//   { name: "Height (Meter)", inputs: 1 },
//   { name: "PayLoad", inputs: 1 },
//   { name: "Total quantity", inputs: 1 },
//   { name: "Estimated Transportation Time", inputs: 1 },
//   { name: "Purchase price per ton", inputs: 1 },
//   { name: "Price per unit", inputs: 1 },
//   { name: "Total purchase price", inputs: 1 },
//   { name: "Selling price", inputs: 1 },
//   { name: "Total price", inputs: 1 },
//   { name: "VAT amount", inputs: 1 },
//   { name: "VAT 18%", inputs: 1 },
//   { name: "Vendor", inputs: 1 },
//   { name: "Price quotation", inputs: 1 },
//   { name: "Note", inputs: 1 },
// ];
//
// export default function Table() {
//   const [columns, setColumns] = useState<Column[]>([{ id: 0, data: {} }]);
//
//   useEffect(() => {
//     const savedCols = localStorage.getItem("table_columns");
//     if (savedCols) {
//       try {
//         const parsed = JSON.parse(savedCols);
//         if (Array.isArray(parsed) && parsed.length > 0) {
//           setColumns(parsed);
//         }
//       } catch {
//         setColumns([{ id: 0, data: {} }]);
//       }
//     }
//   }, []);
//
//   useEffect(() => {
//     localStorage.setItem("table_columns", JSON.stringify(columns));
//   }, [columns]);
//
//   const addColumn = () => {
//     setColumns((prev) => [...prev, { id: prev.length, data: {} }]);
//   };
//
//   const deleteColumn = (colId: number) => {
//     setColumns((prev) => prev.filter((col) => col.id !== colId));
//   };
//
//   // const [modal, setModal] = useState<null | { type: "create" }>(null);
//   // const [pageHelper, setPageHelper] = useState({ render: false });
//   // console.log(pageHelper);
//
//   return (
//     <div className={styles.table_container}>
//       <table className={styles.custom_table}>
//         <tbody>
//           {staticRows.map((row) => (
//             <tr key={row.name}>
//               <td className={styles.static_col}>{row.name}</td>
//               {columns.map((col) => (
//                 <td key={col.id}>
//                   {row.name === "Name of Service" ? (
//                     <div
//                       className={styles.service_cell}
//                       onClick={() => setModal({ type: "create" })}
//                     >
//                       <span>Transport</span>
//                       <SharedIcon />
//                     </div>
//                   ) : (
//                     Array.from({ length: row.inputs }).map((_, i) => (
//                       <div className={styles.input} key={i}>
//                         <input
//                           type="text"
//                           className={`${styles.editable_cell} ${
//                             row.name === "Packaging Type" && i < row.inputs - 1
//                               ? styles.withBorder
//                               : ""
//                           } ${styles.noPointer}`}
//                           value={col.data[`${row.name}_${i}`] || ""}
//                           readOnly
//                         />
//                       </div>
//                     ))
//                   )}
//                 </td>
//               ))}
//             </tr>
//           ))}
//
//           <tr>
//             <td className={styles.static_col}>Action</td>
//             {columns.map((col) => (
//               <td key={col.id} className={styles.action_cell}>
//                 <button
//                   onClick={() => deleteColumn(col.id)}
//                   className={styles.delete_icon}
//                 >
//                   <DeleteIcon />
//                 </button>
//               </td>
//             ))}
//           </tr>
//         </tbody>
//       </table>
//
//       <div className={styles.btn}>
//         <button className={styles.add_btn} onClick={addColumn}>
//           +<p>Add</p>
//         </button>
//       </div>
//
//       {/*{modal?.type === "create" && (*/}
//       {/*  <CreateServicesTable*/}
//       {/*    modalClose={() => {*/}
//       {/*      setModal(null);*/}
//       {/*      setPageHelper((prev) => ({ ...prev, render: !prev.render }));*/}
//       {/*    }}*/}
//       {/*  />*/}
//       {/*)}*/}
//     </div>
//   );
// }
