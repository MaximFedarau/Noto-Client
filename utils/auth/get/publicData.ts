//Types
import { PublicUserData } from '@app-types/types';

//Expo
import * as SecureStore from 'expo-secure-store';

//axios
import axios from 'axios';

export async function getPublicData(accessToken: string, refreshToken: string) {
  let data: PublicUserData | undefined = undefined; // public data = result
  await axios
    .get<PublicUserData>(`${process.env.API_URL}/auth/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => {
      if (!res) return; // no data handling
      data = res.data;
    })
    .catch(async (error) => {
      // if accessToken expired
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
            //setting new tokens
            await SecureStore.setItemAsync('accessToken', res.data.accessToken);
            await SecureStore.setItemAsync(
              'refreshToken',
              res.data.refreshToken,
            );
            const fetchedData = await getPublicData(
              res.data.accessToken,
              res.data.refreshToken,
            ); // receiving data using new tokens
            data = fetchedData;
          })
          .catch(async (error) => {
            //refresh token expired - logging out
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
