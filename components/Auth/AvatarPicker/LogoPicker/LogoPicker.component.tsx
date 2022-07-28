//Types
import React, { ReactElement } from 'react';

//Constants
import { SOFT_BLUE } from '@constants/colors';

//Expo
import * as ImagePicker from 'expo-image-picker';

//Components
import IconButton from '@components/Default/IconButton/IconButton.component';

import { PickedImagePressable, PickedImage } from './LogoPicker.styles';

//React Native
import { View, Alert } from 'react-native';

//Interface for Props
interface LogoPickerProps {
  image: undefined | string;
  setImage: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function LogoPicker({
  image,
  setImage,
}: LogoPickerProps): ReactElement {
  const [cameraPermission, requestPermission] =
    ImagePicker.useMediaLibraryPermissions();

  async function verifyPermissions() {
    if (
      cameraPermission?.status === ImagePicker.PermissionStatus.UNDETERMINED
    ) {
      const response = await requestPermission();

      return response.granted;
    }

    if (cameraPermission?.status === ImagePicker.PermissionStatus.DENIED) {
      Alert.alert(
        'Insufficient permissions',
        'You need to grant Image Gallery permissions to use this app. Please, go to Settings and grant permissions.',
      );
      return false;
    }

    return true;
  }

  async function takeImageHandler() {
    const status = await verifyPermissions();
    if (!status) return;
    const image = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    if (!image.cancelled) {
      setImage(image.uri);
    }
  }
  return (
    <View>
      {!image ? (
        <IconButton
          iconName="person-circle"
          size={256}
          color={SOFT_BLUE}
          onPress={takeImageHandler}
        />
      ) : (
        <PickedImagePressable onPress={takeImageHandler}>
          <PickedImage source={{ uri: image }} />
        </PickedImagePressable>
      )}
    </View>
  );
}
