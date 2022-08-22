import { StyleSheet } from 'react-native';

import { CYBER_YELLOW } from '@constants/colors';

export const styles = StyleSheet.create({
  scrollToEndButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: CYBER_YELLOW,
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
});
