import { PublicUserData } from '@app-types/types';
import { TOAST_TYPE } from '@app-types/enum';
import { createAPIInstance } from '@utils/requests/instance';
import { showToast } from '@utils/toasts/showToast';

export const getPublicData = async () => {
  const instance = createAPIInstance(() => {
    showToast(TOAST_TYPE.ERROR, 'Logout', 'Your session has expired');
  });
  let data: PublicUserData | undefined; // public data = result
  try {
    const res = await instance.get<PublicUserData>('/auth/user');
    if (!res) return; // no data handling
    data = res.data;
  } catch (error) {
    console.error(error, 'fetching public data');
  }
  return data;
};
