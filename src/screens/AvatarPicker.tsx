import React, { FC, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { uploadAsync, FileSystemUploadType } from 'expo-file-system';
import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { AxiosError } from 'axios';

import {
  FormButtons,
  Spinner,
  ContentScrollView,
  LogoPicker,
  AuthScreenContainer,
  AvatarPickerContainer,
} from '@components';
import { setAvatar } from '@store/user';
import {
  AuthStackScreenProps,
  NavigationName,
  ToastType,
  AuthTokens,
  NavigationAuthName,
} from '@types';
import { showToast, createAPIRefreshInstance } from '@utils';

type ScreenProps = AuthStackScreenProps<NavigationAuthName.AVATAR_PICKER>;

export const AvatarPicker: FC = () => {
  const navigation = useNavigation<ScreenProps['navigation']>();
  const route = useRoute<ScreenProps['route']>();

  const dispatch = useDispatch();

  const [image, setImage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const instance = createAPIRefreshInstance(() => {
    showToast(ToastType.ERROR, 'Logout', 'Your session has expired');
    navigateHome();
  });

  const navigateHome = () =>
    navigation.navigate(NavigationName.RECORDS_OVERVIEW);

  const onSubmit = async () => {
    if (!route.params || !image) return;
    setIsLoading(true);

    const accessToken = await getItemAsync('accessToken');
    try {
      const { status, body: avatarUrl } = await uploadAsync(
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
        dispatch(setAvatar(avatarUrl));
        showToast(
          ToastType.SUCCESS,
          'Congratulatons!',
          'Your avatar was uploaded successfully.',
        );
        navigateHome();
        return;
      }

      if (status !== 401) throw new Error();

      try {
        const { data } = await instance.post<AuthTokens>('/auth/token/refresh');
        const { accessToken, refreshToken } = data;
        await setItemAsync('accessToken', accessToken);
        await setItemAsync('refreshToken', refreshToken);
        await onSubmit(); // uploading image again
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
  return (
    <AuthScreenContainer>
      <ContentScrollView>
        <AvatarPickerContainer>
          <LogoPicker image={image} setImage={setImage} disabled={isLoading} />
          {isLoading ? (
            <Spinner />
          ) : (
            <FormButtons onSubmit={onSubmit} onHomeReturn={navigateHome}>
              Submit
            </FormButtons>
          )}
        </AvatarPickerContainer>
      </ContentScrollView>
    </AuthScreenContainer>
  );
};
