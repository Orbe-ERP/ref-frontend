import { JSX } from "react";

export interface IRestaurant {
    id: string;
    name: string;
  }
  
  export interface ISelected {
    selected?: boolean;
  }
  
  export interface IAuthProvider {
    children: JSX.Element;
  }
  