import { useEffect, useRef, useState } from "react";
import styles from "./DimensionBox.module.scss";
import Input from "@/components/Input/Input.tsx";
import useClickOutside from "@/hooks/useClickOutside.ts";

type DimensionBoxProps = {
  label: string;
  dimensions: { width: string; height: string; length: string } | any;
  setDimension: (value: any, name: "width" | "height" | "length") => void;
};

const DimensionBox = ({
  label,
  dimensions,
  setDimension,
}: DimensionBoxProps) => {
  const [dropdown, setDropdown] = useState(false);

  const boxRef = useRef<HTMLDivElement>(null);
  const clickedInside = useClickOutside(boxRef);

  useEffect(() => {
    if (!clickedInside) {
      setDropdown(false);
    }
  }, [clickedInside]);

  return (
    <div className={styles.dimension__box}>
      <Input
        label={label}
        placeholder={label}
        value={`${dimensions.width}x${dimensions.height}x${dimensions.length}`}
        style={{
          outline: "none",
          cursor: "pointer",
        }}
        onClick={() =>
          setDropdown((prevState) => {
            return !prevState;
          })
        }
        onChange={() => {}}
      />
      {dropdown && (
        <div className={styles.dropdown} ref={boxRef}>
          <Input
            label={"Width"}
            placeholder={"Width"}
            type={"number"}
            textStyle={{
              fontSize: 14,
            }}
            style={{
              height: 36,
            }}
            value={dimensions.width}
            onChange={(event) => {
              setDimension(event.target.value, "width");
            }}
          />
          <Input
            label={"Height"}
            placeholder={"Height"}
            type={"number"}
            textStyle={{
              fontSize: 14,
            }}
            style={{
              height: 36,
            }}
            value={dimensions.height}
            onChange={(event) => {
              setDimension(event.target.value, "height");
            }}
          />
          <Input
            label={"Length"}
            placeholder={"Length"}
            type={"number"}
            textStyle={{
              fontSize: 14,
            }}
            style={{
              height: 36,
            }}
            value={dimensions.length}
            onChange={(event) => {
              setDimension(event.target.value, "length");
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DimensionBox;
