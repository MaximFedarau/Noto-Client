import { StyleSheet } from 'react-native';

import { SIZES, COLORS } from '@constants';

export const styles = (backgroundColor = COLORS.black) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: SIZES.sm,
      flexDirection: 'row',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32%',
      height: SIZES['4xl'],
      borderRadius: SIZES.lg,
      backgroundColor,
    },
  });
