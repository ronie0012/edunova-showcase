import { useEffect, useState } from "react";

/** Simulates a slowly-fluctuating live metric. */
export function LiveNumber({ value, prefix = "", suffix = "", drift = 0.002, format }: {
  value: number;
  prefix?: string;
  suffix?: string;
  drift?: number;
  format?: (n: number) => string;
}) {
  const [n, setN] = useState(value);
  useEffect(() => {
    const id = setInterval(() => {
      const delta = (Math.random() - 0.45) * value * drift;
      setN((prev) => Math.max(0, prev + delta));
    }, 2500);
    return () => clearInterval(id);
  }, [value, drift]);
  const display = format ? format(n) : Math.round(n).toLocaleString("en-IN");
  return <span>{prefix}{display}{suffix}</span>;
}
