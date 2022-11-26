import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  // ! warning: I took this piece of code exactly from the react-navigation module (node_modules/@react-navigation/elements/lib/commonjs/Header/HeaderTitle.js) itself, because react navigation do
  // ! not have a way to set the header title default style.
  // ! So, in the next version of this module, the code may change.
  title: Platform.select({
    ios: {
      fontSize: 17,
      fontWeight: '600',
      fontFamily: 'Roboto-Regular',
    },
    android: {
      fontSize: 20,
      fontFamily: 'Roboto-Regular',
      fontWeight: 'normal',
    },
    default: {
      fontSize: 18,
      fontWeight: '500',
    },
  }),
});
