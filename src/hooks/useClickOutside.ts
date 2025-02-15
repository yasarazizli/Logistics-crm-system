import { MutableRefObject, useEffect, useState } from "react";

export default function useClickOutside(ref: MutableRefObject<any>) {
  const [clickedOutside, setClickedOutside] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        setClickedOutside(true);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  useEffect(() => {
    setClickedOutside(false);
  }, [clickedOutside]);

  return clickedOutside;
}
