import { AxiosError } from 'axios';

import { ToastType, Profile } from '@types';
import { createAPIInstance } from '@utils/api/instance';
import { showToast } from '@utils/showToast';

export const getPublicData = async () => {
  const instance = createAPIInstance(() => {
    showToast(ToastType.ERROR, 'Logout', 'Your session has expired');
  });
  let data: Profile | undefined;
  try {
    const res = await instance.get<Profile>('/auth/user');
    if (!res) return;
    data = res.data;
  } catch (error) {
    console.error(error, 'getting public data');
    let message = 'Error occurred while getting public data.';
    if (error instanceof AxiosError)
      message = error.response?.data.message || message;
    else if (error instanceof Error) message = error.message || message;
    throw new Error(message);
  }
  return data;
};
