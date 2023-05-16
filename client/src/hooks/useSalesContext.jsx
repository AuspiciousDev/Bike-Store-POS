import { SalesContext } from "../context/SaleContext";
import { useContext } from "react";

export const useSalesContext = () => {
  const context = useContext(SalesContext);

  if (!context) {
    throw Error("SalesContext must be used inside a SalesContextProvider");
  }
  return context;
};
