//Types
import React, { ReactElement } from 'react';

//Constants
import { styles } from './LogoPicker.styles';

//Expo
import * as ImagePicker from 'expo-image-picker';

//Components
import { PickedImage } from './LogoPicker.styles';

//React Native
import { View, Alert, Pressable } from 'react-native';

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

  //checking permissions
  async function verifyPermissions() {
    if (
      cameraPermission?.status === ImagePicker.PermissionStatus.UNDETERMINED
    ) {
      const response = await requestPermission();

      return response.granted;
    }

    if (cameraPermission?.status === ImagePicker.PermissionStatus.DENIED) {
      // asking for checking the phone preferences
      Alert.alert(
        'Insufficient permissions',
        'You need to grant Image Gallery permissions to use this app. Please, go to Settings and grant permissions.',
      );
      return false;
    }

    return true;
  }

  // getting image from gallery
  async function takeImageHandler() {
    const status = await verifyPermissions();
    if (!status) return;
    const image = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1, // best quality
    });
    if (!image.cancelled) {
      setImage(image.uri);
    }
  }
  return (
    <View>
      {!image ? (
        <Pressable
          onPress={takeImageHandler}
          style={({ pressed }) => [
            pressed ? { opacity: 0.5 } : {},
            styles.button,
          ]}
        >
          <PickedImage source={require('@assets/images/empty-avatar.png')} />
        </Pressable>
      ) : (
        <Pressable
          onPress={takeImageHandler}
          style={({ pressed }) => [
            pressed ? { opacity: 0.5 } : {},
            styles.button,
            {
              marginBottom: 16,
            },
          ]}
        >
          <PickedImage source={{ uri: image }} />
        </Pressable>
      )}
    </View>
  );
}
