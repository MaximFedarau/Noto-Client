//Types
import { PublicUserData } from '@app-types/types';

//Expo
import * as SecureStore from 'expo-secure-store';

//axios
import axios from 'axios';

export async function getPublicData(accessToken: string, refreshToken: string) {
  let data: PublicUserData | undefined = undefined;
  await axios
    .get<PublicUserData>(`${process.env.API_URL}/auth/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => {
      if (!res) return;
      data = res.data;
    })
    .catch(async (error) => {
      if (error.response.data.statusCode === 401) {
        await axios
          .post(
            `${process.env.API_URL}/auth/token/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            },
          )
          .then(async (res) => {
            await SecureStore.setItemAsync('accessToken', res.data.accessToken);
            await SecureStore.setItemAsync(
              'refreshToken',
              res.data.refreshToken,
            );
            const fetchedData = await getPublicData(
              res.data.accessToken,
              res.data.refreshToken,
            );
            data = fetchedData;
          })
          .catch(async (error) => {
            if (error.response.data.statusCode === 401) {
              await SecureStore.deleteItemAsync('accessToken');
              await SecureStore.deleteItemAsync('refreshToken');
            }
          });
      }
    });
  return data;
}

getPublicData.defaultProps = {
  API_URL: (process.env.API_URL = 'http://localhost:5000'),
};
