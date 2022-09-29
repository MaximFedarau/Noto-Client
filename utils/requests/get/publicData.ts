import { PublicUserData } from '@app-types/types';
import { createAPIInstance } from '@utils/requests/instance';
import { showingSubmitError } from '@utils/toastInteraction/showingSubmitError';

export const getPublicData = async () => {
  const instance = createAPIInstance(() => {
    showingSubmitError('Logout', 'Your session has expired', undefined);
  });
  let data: PublicUserData | undefined = undefined; // public data = result
  await instance
    .get<PublicUserData>('/auth/user')
    .then((res) => {
      if (!res) return; // no data handling
      data = res.data;
    })
    .catch((error) => {
      console.error(error, 'fetching public data');
    });
  return data;
};
