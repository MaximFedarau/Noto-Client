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
    console.error(error, 'fetching public data');
  }
  return data;
};
