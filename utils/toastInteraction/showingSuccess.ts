import Toast from 'react-native-toast-message';

export const showingSuccess = (
  title: string,
  text: string,
  topOffset?: number,
  callback?: () => void,
) => {
  if (callback) callback(); // possible callback execution, for example, setting loading state to false
  Toast.show({
    position: 'top',
    text1: title,
    text2: text,
    topOffset: topOffset,
    visibilityTime: 5000,
  });
};
