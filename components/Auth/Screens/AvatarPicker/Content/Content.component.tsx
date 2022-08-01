//Types
import React, { ReactElement } from 'react';
import { NavigationProps, NavigationRouteProp } from '@app-types/types';
import { NAVIGATION_NAMES } from '@app-types/enum';

//Constants
import { showingSubmitError } from '@utils/showingSubmitError';

//Expo
import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';

//Components
import ContentScrollView from '@components/Auth/Defaults/ContentScrollView/ContentScrollView.component';
import LogoPicker from '@components/Auth/Screens/AvatarPicker/LogoPicker/LogoPicker.component';
import Spinner from '@components/Auth/Defaults/Spinner/Spinner.component';
import FormButtons from '@components/Auth/Defaults/FormButtons/FormButtons.component';

import { AuthAvatarPickerContainer } from '@components/Default/View/View.component';

//React Navigation
import { useRoute, useNavigation } from '@react-navigation/native';

//axios
import axios from 'axios';

export default function Content(): ReactElement {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<NavigationRouteProp>();

  const [image, setImage] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState(false);

  // image uploading
  async function onSubmitHandler() {
    if (!route.params || !image) return; // if there is no id or image, then function hadnling is cancelled
    setIsLoading(true);
    // image uploading
    const accessToken = await SecureStore.getItemAsync('accessToken'); // getting access token with goal to access API
    const refreshToken = await SecureStore.getItemAsync('refreshToken'); // getting refresh token with goal to refresh access token
    const data = await FileSystem.uploadAsync(
      `${process.env.API_URL}/auth/image/upload/${route.params.id}`,
      image,
      {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART, // multipart upload type
        fieldName: 'file', // field name for image (like on backend)
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (data.status >= 400) {
      // if the status is >= 400 (client or server error), then the image was not uploaded
      if (data.status !== 401) {
        // if the status is not 401 (unauthorized), then we just show the error
        showingSubmitError(
          'Avatar Uploading Error',
          'Something went wrong:( Try again later',
          () => {
            setIsLoading(false);
          },
        );
      }
      // in other case, we need to refresh the access token
      axios
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
          await SecureStore.setItemAsync('accessToken', res.data.accessToken); // setting new access token
          await SecureStore.setItemAsync('refreshToken', res.data.refreshToken); // setting new refresh token
          await onSubmitHandler(); // uploading image again
        })
        .catch(async (error) => {
          // if the refresh token is expired, then we need to logout
          if (error.response.data.statusCode === 401) {
            // making our tokens nullable
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
            handleReturnToHome(); // returning home
          }
        });
    } else {
      // if everyting is successful, then we need to go home
      handleReturnToHome();
    }
  }

  //returning home handler
  function handleReturnToHome() {
    navigation.replace(NAVIGATION_NAMES.NOTES_OVERVIEW);
  }

  return (
    <ContentScrollView>
      <AuthAvatarPickerContainer>
        <LogoPicker image={image} setImage={setImage} />
        {isLoading ? (
          <Spinner />
        ) : (
          <FormButtons
            onSubmit={onSubmitHandler}
            onHomeReturn={handleReturnToHome}
          >
            Submit
          </FormButtons>
        )}
      </AuthAvatarPickerContainer>
    </ContentScrollView>
  );
}

Content.defaultProps = {
  API_URL: (process.env.API_URL = 'http://localhost:5000'),
};
