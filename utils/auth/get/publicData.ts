import { PublicUserData } from '@app-types/types';
import { createAPIInstance } from '@utils/requests/instance';

export const getPublicData = async () => {
  const instance = createAPIInstance();
  let data: PublicUserData | undefined = undefined; // public data = result
  await instance
    .get<PublicUserData>('/auth/user')
    .then((res) => {
      if (!res) return; // no data handling
      data = res.data;
    })
    .catch((error) => {
      console.error(error.response, 'fetching public data');
    });
  return data;
};
