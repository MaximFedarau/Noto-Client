import Toast from 'react-native-toast-message';

import { ToastType } from '@types';

export const showToast = (type: ToastType, title: string, text: string) => {
  Toast.show({
    type: type,
    text1: title,
    text2: text,
  });
  if (type === ToastType.ERROR) console.error(`${title}\n`, text);
};
