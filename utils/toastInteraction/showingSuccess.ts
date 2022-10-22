import Toast from 'react-native-toast-message';

export const showingSuccess = (
  title: string,
  text: string,
  topOffset?: number,
) => {
  Toast.show({
    position: 'top',
    text1: title,
    text2: text,
    topOffset,
  });
};
