import { InventoryContext } from "../context/InventoryContext";
import { useContext } from "react";

export const useInventoriesContext = () => {
  const context = useContext(InventoryContext);

  if (!context) {
    throw Error(
      "useInventoriesContext must be used inside a InventoryContextProvider"
    );
  }
  return context;
};
