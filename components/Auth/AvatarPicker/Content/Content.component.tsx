//Types
import React, { ReactElement } from 'react';
import { NavigationProps, NavigationRouteProp } from '@app-types/types';
import { NAVIGATION_NAMES } from '@app-types/enum';

//Constants
import { showingSubmitError } from '@utils/showingSubmitError';

//Expo
import * as FileSystem from 'expo-file-system';

//Components
import LogoPicker from '@components/Auth/AvatarPicker/LogoPicker/LogoPicker.component';

import { AuthNavigationText } from '@components/Default/Text/Text.component';
import { AuthFormButtonsContainer } from '@components/Default/View/View.component';
import { FormSubmitButton } from '@components/Auth/FormButtons/FormButtons.styles';

//React Native
import { View, ActivityIndicator, ScrollView } from 'react-native';

//React Navigation
import { useRoute, useNavigation } from '@react-navigation/native';

export default function Content(): ReactElement {
  // * Variables
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<NavigationRouteProp>();
  // * States
  const [image, setImage] = React.useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  async function onSubmitHandler() {
    if (!route.params || !image) return;
    setIsLoading(true);
    // is user wants to upload an image, then we upload it
    const data = await FileSystem.uploadAsync(
      `${process.env.API_URL}/auth/image/upload/${route.params.id}`,
      image,
      {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'file',
      },
    );
    if (data.status >= 400) {
      // if the status is >= 400 (client or server error), then the image was not uploaded
      showingSubmitError(
        'Avatar Uploading Error',
        'Something went wrong:( Try again later',
        () => {
          setIsLoading(false);
        },
      );
    } else {
      onHomeReturnHandler();
    }
  }

  function onHomeReturnHandler() {
    navigation.replace(NAVIGATION_NAMES.NOTES_OVERVIEW);
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16%',
      }}
      bounces={false}
    >
      <LogoPicker image={image} setImage={setImage} />
      <AuthNavigationText onPress={onHomeReturnHandler}>
        Add later?
      </AuthNavigationText>
      <AuthFormButtonsContainer>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FormSubmitButton
            textStyle={{
              color: 'white',
              fontSize: 22,
              fontWeight: 'bold',
            }}
            onPress={onSubmitHandler}
          >
            Add
          </FormSubmitButton>
        )}
      </AuthFormButtonsContainer>
    </ScrollView>
  );
}

Content.defaultProps = {
  API_URL: (process.env.API_URL = 'http://192.168.100.248:5000'),
};
