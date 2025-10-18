import 'styled-components/native';
import { AppTheme } from '../context/ThemeProvider/index';

declare module "styled-components/native" {
  export interface DefaultTheme extends AppTheme { }
}