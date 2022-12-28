import { StyleSheet } from 'react-native';

import { SIZES } from '@constants';

export const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingVertical: SIZES.sm / 2,
  },
  submitButton: {
    height: SIZES['7xl'],
    width: '80%',
    maxWidth: 300,
  },
});
