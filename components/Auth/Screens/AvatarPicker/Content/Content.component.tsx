import React, { ReactElement } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';
import { AxiosError } from 'axios';

import ContentScrollView from '@components/Auth/Defaults/ContentScrollView/ContentScrollView.component';
import LogoPicker from '@components/Auth/Screens/AvatarPicker/LogoPicker/LogoPicker.component';
import Spinner from '@components/Auth/Defaults/Spinner/Spinner.component';
import FormButtons from '@components/Auth/Defaults/FormButtons/FormButtons.component';
import { AuthAvatarPickerContainer } from '@components/Default/View/View.component';
import {
  NavigationProps,
  AvatarPickerRouteProp,
  AuthTokens,
} from '@app-types/types';
import { NAVIGATION_NAMES } from '@app-types/enum';
import { showingSubmitError } from '@utils/toastInteraction/showingSubmitError';
import { showingSuccess } from '@utils/toastInteraction/showingSuccess';
import { createAPIRefreshInstance } from '@utils/requests/instance';

export default function Content(): ReactElement {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<AvatarPickerRouteProp>();

  const [image, setImage] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState(false);

  // image uploading
  const onSubmitHandler = async () => {
    if (!route.params || !image) return; // if there is no id or image, then function hadnling is cancelled
    setIsLoading(true);
    // image uploading
    const accessToken = await SecureStore.getItemAsync('accessToken'); // getting access token with goal to access API
    const { status } = await FileSystem.uploadAsync(
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
    if (status >= 400) {
      // if the status is >= 400 (client or server error), then the image was not uploaded
      if (status !== 401) {
        // if the status is not 401 (unauthorized), then we just show the error
        showingSubmitError(
          'Avatar Uploading Error',
          'Something went wrong:( Try again later',
          undefined,
          () => {
            setIsLoading(false);
          },
        );
        return;
      }

      // in other case, we need to refresh the access token
      const instance = createAPIRefreshInstance(() => {
        showingSubmitError('Logout', 'Your session has expired', undefined);
        handleReturnToHome();
      });
      try {
        const { data } = await instance.post<AuthTokens>(`/auth/token/refresh`);
        const { accessToken, refreshToken } = data;
        await SecureStore.setItemAsync('accessToken', accessToken); // setting new access token
        await SecureStore.setItemAsync('refreshToken', refreshToken); // setting new refresh token
        await onSubmitHandler(); // uploading image again
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 401) return;
        console.error(error, 'image uploading error');
      }
    } else {
      // if everyting is successful, then we need to go home
      showingSuccess(
        'Congratulatons!',
        'Your avatar was uploaded successfully.',
      );
      handleReturnToHome();
    }
  };

  //returning home handler
  const handleReturnToHome = () => {
    navigation.navigate(NAVIGATION_NAMES.NOTES_OVERVIEW);
  };

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
