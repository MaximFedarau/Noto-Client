import { StyleSheet } from 'react-native';

import { SIZES, FONTS } from '@constants';

export const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES['2xl'],
  },
  input: {
    fontSize: FONTS.sizes.xl,
  },
  label: {
    fontWeight: '400',
  },
  error: {
    fontSize: FONTS.sizes.base,
  },
});
