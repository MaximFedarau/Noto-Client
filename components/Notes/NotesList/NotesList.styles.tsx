import { StyleSheet } from 'react-native';

import { SOFT_BLUE } from '@constants/colors';

export const styles = StyleSheet.create({
  scrollToEndButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    alignSelf: 'center',
    backgroundColor: SOFT_BLUE,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 24,
  },
});
