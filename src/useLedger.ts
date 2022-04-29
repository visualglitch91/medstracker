import { useEffect, useState } from "react";
import enhancedAsyncStorage from "./enhancedAsyncStorage";

interface Ledger {
  [date: string]: boolean | undefined;
}

export default function useLedger() {
  const [ledger, setLedger] = useState<Ledger>({});

  useEffect(() => {
    enhancedAsyncStorage
      .getItem<Ledger>("ledger", {})
      .then((value) => value && setLedger(value));
  }, []);

  useEffect(() => {
    enhancedAsyncStorage.setItem("ledger", ledger);
  }, [ledger]);

  return [ledger, setLedger] as const;
}
