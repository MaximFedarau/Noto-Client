import { StyleSheet } from 'react-native';

export const getStyles = (size: number) =>
  StyleSheet.create({
    button: {
      width: size,
      height: size,
      borderRadius: size / 2,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
    },
    spinner: {
      position: 'absolute',
    },
    image: {
      width: '100%',
      height: '100%',
    },
  });
