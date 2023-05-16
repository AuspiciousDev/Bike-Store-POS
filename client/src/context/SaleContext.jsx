import React from "react";
import { createContext, useReducer } from "react";
export const SalesContext = createContext();

export const salesReducer = (state, action) => {
  switch (action.type) {
    case "SET_SALES":
      return {
        sales: action.payload,
      };
    case "CREATE_SALE":
      return {
        sales: [action.payload, ...state.sales],
      };
    case "DELETE_SALE":
      return {
        sales: state.sales.filter((w) => w._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const SalesContextProvider = ({ children }) => {
  const [state, salesDispatch] = useReducer(salesReducer, {
    sales: null,
  });

  return (
    <SalesContext.Provider value={{ ...state, salesDispatch }}>
      {children}
    </SalesContext.Provider>
  );
};
