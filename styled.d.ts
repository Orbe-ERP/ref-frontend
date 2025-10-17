// import {AppTheme} from './theme/index'
// import 'styled-components/native'; 

// declare module "styled-components/native" {
//   export interface DefaultTheme extends AppTheme {}
// }

import 'styled-components/native';
import { AppTheme } from './theme';

declare module 'styled-components/native' {
  export interface DefaultTheme extends AppTheme {}
}