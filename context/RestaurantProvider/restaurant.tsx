import React, { createContext, useState, ReactNode } from "react";
import { IRestaurant } from "./types";

export interface IRestaurantContext {
  selectedRestaurant: IRestaurant | null;
  selectRestaurant: (restaurant: IRestaurant | null) => void;
}

export const RestaurantContext =
  createContext<IRestaurantContext | null>(null);

export const RestaurantProvider = ({ children }: { children: ReactNode }) => {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<IRestaurant | null>(null);

  const selectRestaurant = (restaurant: IRestaurant | null) => {
    setSelectedRestaurant(restaurant);
  };

  return (
    <RestaurantContext.Provider
      value={{ selectedRestaurant, selectRestaurant }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};
