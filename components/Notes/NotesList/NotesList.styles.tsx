import { StyleSheet } from 'react-native';

import { SOFT_BLUE } from '@constants/colors';

export const styles = StyleSheet.create({
  scrollToEndButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: SOFT_BLUE,
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
});
