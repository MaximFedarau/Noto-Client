// ! Important
import 'styled-components/native';

import { COLORS } from '@constants/theme/colors';
import { FONTS } from '@constants/theme/fonts';
import { SIZES } from '@constants/theme/sizes';

/* Custom type for styled-components/native DefaultTheme */
declare module 'styled-components/native' {
  export interface DefaultTheme {
    colors: typeof COLORS;
    fonts: typeof FONTS;
    sizes: typeof SIZES;
  }
}
