import React, { createContext, useState, ReactNode } from "react";
import { IRestaurant } from "./types";

export interface IContext {
  selectedRestaurant: IRestaurant | null;
  selectRestaurant: (restaurant: IRestaurant) => void;
}

export const RestaurantContext = createContext<IContext | undefined>(undefined);

interface RestaurantProviderProps {
  children: ReactNode;
}

export const RestaurantProvider = ({ children }: RestaurantProviderProps) => {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<IRestaurant | null>(null);

  const selectRestaurant = (restaurant: IRestaurant) => {
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
