import { JSX } from "react";

export interface IRestaurant {
    id: string;
    name: string;
  }
  
  export interface ISelected {
    selected?: boolean;
  }
  
  export interface IContext extends IRestaurant {
    selectRestaurant: (i: IRestaurant | null) => Promise<void>;
    selectedRestaurant: () => IRestaurant | null;
  }
  
  export interface IAuthProvider {
    children: JSX.Element;
  }
  