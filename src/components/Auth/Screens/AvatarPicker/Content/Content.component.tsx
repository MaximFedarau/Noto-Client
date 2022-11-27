import React, { FC, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { uploadAsync, FileSystemUploadType } from 'expo-file-system';
import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { AxiosError } from 'axios';

import ContentScrollView from '@components/Auth/Defaults/ContentScrollView/ContentScrollView.component';
import LogoPicker from '@components/Auth/Screens/AvatarPicker/LogoPicker/LogoPicker.component';
import Spinner from '@components/Auth/Defaults/Spinner/Spinner.component';
import FormButtons from '@components/Auth/Defaults/FormButtons/FormButtons.component';
import { AuthAvatarPickerContainer } from '@components/Default/View/View.component';
import {
  AvatarPickerRouteProp,
  NavigationProps,
  NavigationName,
  ToastType,
  AuthTokens,
} from '@types';
import { showToast } from '@utils/toasts/showToast';
import { createAPIRefreshInstance } from '@utils/requests/instance';

const Content: FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<AvatarPickerRouteProp>();

  const [image, setImage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const instance = createAPIRefreshInstance(() => {
    showToast(ToastType.ERROR, 'Logout', 'Your session has expired');
    handleReturnToHome();
  });

  const onSubmitHandler = async () => {
    if (!route.params || !image) return;
    setIsLoading(true);

    const accessToken = await getItemAsync('accessToken');
    try {
      const { status } = await uploadAsync(
        `${process.env.API_URL}/auth/image/upload/${route.params.id}`,
        image,
        {
          httpMethod: 'POST',
          uploadType: FileSystemUploadType.MULTIPART, // multipart upload type
          fieldName: 'file', // field name for image (like on backend)
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (status < 400) {
        showToast(
          ToastType.SUCCESS,
          'Congratulatons!',
          'Your avatar was uploaded successfully.',
        );
        handleReturnToHome();
        return;
      }

      if (status !== 401) throw new Error();

      try {
        const { data } = await instance.post<AuthTokens>('/auth/token/refresh');
        const { accessToken, refreshToken } = data;
        await setItemAsync('accessToken', accessToken);
        await setItemAsync('refreshToken', refreshToken);
        await onSubmitHandler(); // uploading image again
      } catch (error) {
        const { response } = error as AxiosError;
        if (response && response.status === 401) return;
        throw new Error();
      }
    } catch (error) {
      setIsLoading(false);
      showToast(
        ToastType.ERROR,
        'Avatar Uploading Error',
        'Something went wrong:( Try again later',
      );
    }
  };

  const handleReturnToHome = () =>
    navigation.navigate(NavigationName.NOTES_OVERVIEW);

  return (
    <ContentScrollView>
      <AuthAvatarPickerContainer>
        <LogoPicker image={image} setImage={setImage} disabled={isLoading} />
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
};

export default Content;
