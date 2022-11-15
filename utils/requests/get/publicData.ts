import { PublicUserData } from '@app-types/types';
import { createAPIInstance } from '@utils/requests/instance';
import { showingSubmitError } from '@utils/toastInteraction/showingSubmitError';

export const getPublicData = async () => {
  const instance = createAPIInstance(() => {
    showingSubmitError('Logout', 'Your session has expired', undefined);
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
