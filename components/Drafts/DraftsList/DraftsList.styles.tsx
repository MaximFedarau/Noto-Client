import { StyleSheet } from 'react-native';

import { CYBER_YELLOW } from '@constants/colors';

export const styles = StyleSheet.create({
  scrollToEndButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    alignSelf: 'center',
    backgroundColor: CYBER_YELLOW,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 24,
  },
});
