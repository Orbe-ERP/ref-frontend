import { JSX } from "react";

export interface IRestaurant {
    id: string;
    name: string
  }
  
  export interface ISelected {
    selected?: boolean;
  }
  
  export interface IContext extends IRestaurant {
    selectRestaurant: (i: IRestaurant) => Promise<void>;
    selectedRestaurant: () => IRestaurant;
  }
  
  export interface IAuthProvider {
    children: JSX.Element;
  }
  