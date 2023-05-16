import React from "react";
import { createContext, useReducer } from "react";
export const RestocksContext = createContext();

export const restocksReducer = (state, action) => {
  switch (action.type) {
    case "SET_RESTOCKS":
      return {
        restocks: action.payload,
      };
    case "CREATE_RESTOCK":
      return {
        restocks: [action.payload, ...state.restocks],
      };
    case "DELETE_RESTOCK":
      return {
        restocks: state.restocks.filter((w) => w._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const RestocksContextProvider = ({ children }) => {
  const [state, restockDispatch] = useReducer(restocksReducer, {
    restocks: null,
  });

  return (
    <RestocksContext.Provider value={{ ...state, restockDispatch }}>
      {children}
    </RestocksContext.Provider>
  );
};
