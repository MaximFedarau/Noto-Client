//Types
import React, { ReactElement } from 'react';
import { NavigationProps, NavigationRouteProp } from '@app-types/types';
import { NAVIGATION_NAMES } from '@app-types/enum';

//Constants
import { showingSubmitError } from '@utils/showingSubmitError';

//Expo
import * as FileSystem from 'expo-file-system';

//Components
import ContentScrollView from '@components/Auth/Defaults/ContentScrollView/ContentScrollView.component';
import LogoPicker from '@components/Auth/Screens/AvatarPicker/LogoPicker/LogoPicker.component';
import Spinner from '@components/Auth/Defaults/Spinner/Spinner.component';
import FormButtons from '@components/Auth/Defaults/FormButtons/FormButtons.component';

import { AuthAvatarPickerContainer } from '@components/Default/View/View.component';

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
    <ContentScrollView>
      <AuthAvatarPickerContainer>
        <LogoPicker image={image} setImage={setImage} />
        {isLoading ? (
          <Spinner />
        ) : (
          <FormButtons
            onSubmit={onSubmitHandler}
            onHomeReturn={onHomeReturnHandler}
          >
            Submit
          </FormButtons>
        )}
      </AuthAvatarPickerContainer>
    </ContentScrollView>
  );
}

Content.defaultProps = {
  API_URL: (process.env.API_URL = 'http://192.168.100.248:5000'),
};
