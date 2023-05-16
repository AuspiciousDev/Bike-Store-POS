import { RestocksContext } from "../context/RestockContext";
import { useContext } from "react";

export const useRestocksContext = () => {
  const context = useContext(RestocksContext);

  if (!context) {
    throw Error(
      "useRestocksContext must be used inside a RestockContextProvider"
    );
  }
  return context;
};
