//Expo
import * as SecureStore from 'expo-secure-store';

//axios
import axios from 'axios';

//Interface for Data
interface publicData {
  nickname: string;
  avatar?: string;
}

export async function getPublicData(accessToken: string, refreshToken: string) {
  let ownAccessToken = accessToken;
  let ownRefreshToken = refreshToken;
  let data: publicData = {
    // return data
    nickname: '',
    avatar: undefined,
  };
  await axios
    .post(
      `${process.env.API_URL}/auth/token/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${ownRefreshToken}`,
        },
      },
    )
    .then(async (res) => {
      await SecureStore.setItemAsync('accessToken', res.data.accessToken);
      await SecureStore.setItemAsync('refreshToken', res.data.refreshToken);
      ownAccessToken = res.data.accessToken;
      ownRefreshToken = res.data.refreshToken;
    });
  await axios
    .get<publicData>(`${process.env.API_URL}/auth/user`, {
      headers: {
        Authorization: `Bearer ${ownAccessToken}`,
      },
    })
    .then((res) => {
      if (!res) return;
      data = res.data;
    });
  return data;
}

getPublicData.defaultProps = {
  API_URL: (process.env.API_URL = 'http://localhost:5000'),
};
