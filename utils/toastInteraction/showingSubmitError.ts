import Toast from 'react-native-toast-message';

export const showingSubmitError = (
  title: string,
  text: string,
  topOffset?: number,
  callback?: () => void,
) => {
  if (callback) callback(); // possible callback execution, for example, setting loading state to false
  Toast.show({
    type: 'error',
    position: 'top',
    text1: title,
    text2: text,
    topOffset,
  });
  console.error(`${title}\n`, text); // logging
};
