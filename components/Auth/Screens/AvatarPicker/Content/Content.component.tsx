import React, { ReactElement } from 'react';
import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';
import { useRoute, useNavigation } from '@react-navigation/native';

import ContentScrollView from '@components/Auth/Defaults/ContentScrollView/ContentScrollView.component';
import LogoPicker from '@components/Auth/Screens/AvatarPicker/LogoPicker/LogoPicker.component';
import Spinner from '@components/Auth/Defaults/Spinner/Spinner.component';
import FormButtons from '@components/Auth/Defaults/FormButtons/FormButtons.component';
import { AuthAvatarPickerContainer } from '@components/Default/View/View.component';
import { NavigationProps, NavigationRouteProp } from '@app-types/types';
import { NAVIGATION_NAMES } from '@app-types/enum';
import { showingSubmitError } from '@utils/toastInteraction/showingSubmitError';
import { createAPIRefreshInstance } from '@utils/requests/instance';

export default function Content(): ReactElement {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<NavigationRouteProp>();

  const [image, setImage] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState(false);

  // image uploading
  const onSubmitHandler = async () => {
    if (!route.params || !image) return; // if there is no id or image, then function hadnling is cancelled
    setIsLoading(true);
    // image uploading
    const accessToken = await SecureStore.getItemAsync('accessToken'); // getting access token with goal to access API
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
          undefined,
          () => {
            setIsLoading(false);
          },
        );
      }
      // in other case, we need to refresh the access token
      const instance = createAPIRefreshInstance(handleReturnToHome);
      instance
        .post(`/auth/token/refresh`, {})
        .then(async (res) => {
          await SecureStore.setItemAsync('accessToken', res.data.accessToken); // setting new access token
          await SecureStore.setItemAsync('refreshToken', res.data.refreshToken); // setting new refresh token
          await onSubmitHandler(); // uploading image again
        })
        .catch((error) => {
          console.error(error, 'image uploading error');
        });
    } else {
      // if everyting is successful, then we need to go home
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
