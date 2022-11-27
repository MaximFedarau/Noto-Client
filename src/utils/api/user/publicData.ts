import { ToastType, User } from '@types';
import { createAPIInstance } from '@utils/api/instance';
import { showToast } from '@utils/showToast';

export const getPublicData = async () => {
  const instance = createAPIInstance(() => {
    showToast(ToastType.ERROR, 'Logout', 'Your session has expired');
  });
  let data: User | undefined; // public data = result
  try {
    const res = await instance.get<User>('/auth/user');
    if (!res) return; // no data handling
    data = res.data;
  } catch (error) {
    console.error(error, 'fetching public data');
  }
  return data;
};
