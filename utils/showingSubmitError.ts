//React Native Toast Message
import Toast from 'react-native-toast-message';

export function showingSubmitError(
  title: string,
  text: string,
  callback?: () => void,
) {
  if (callback) callback();
  Toast.show({
    type: 'error',
    position: 'top',
    text1: title,
    text2: text,
  });
  console.error(`${title}\n`, text);
}
