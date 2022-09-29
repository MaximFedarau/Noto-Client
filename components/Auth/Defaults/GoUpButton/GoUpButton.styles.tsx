import { StyleSheet } from 'react-native';

export const styles = (color = 'black') =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: 8,
      flexDirection: 'row',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32%',
      height: 32,
      borderRadius: 16,
      backgroundColor: color,
    },
  });
