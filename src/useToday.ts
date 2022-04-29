import format from "date-fns/format";
import { useEffect, useState } from "react";

function getToday() {
  return format(new Date(), "yyyy-MM-dd");
}

export default function useToday() {
  const [today, setToday] = useState(getToday);

  useEffect(() => {
    const interval = setInterval(() => {
      setToday(getToday());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return today;
}
