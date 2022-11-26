import Toast from 'react-native-toast-message';

import { TOAST_TYPE } from '@app-types/enum';

export const showToast = (type: TOAST_TYPE, title: string, text: string) => {
  Toast.show({
    type: type,
    text1: title,
    text2: text,
  });
  if (type === TOAST_TYPE.ERROR) console.error(`${title}\n`, text);
};
