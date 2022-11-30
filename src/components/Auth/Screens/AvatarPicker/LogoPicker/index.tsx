import React, { FC } from 'react';
import { Alert, Pressable } from 'react-native';
import {
  useMediaLibraryPermissions,
  PermissionStatus,
  launchImageLibraryAsync,
} from 'expo-image-picker';
import Svg, { Path } from 'react-native-svg';

import { showToast } from '@utils';
import { ToastType } from '@types';

import { styles, PickedImage } from './styles';

interface Props {
  setImage: React.Dispatch<React.SetStateAction<string | undefined>>;
  image?: string;
  disabled?: boolean;
}

const LogoPicker: FC<Props> = ({ image, setImage, disabled = false }) => {
  const [cameraPermission, requestPermission] = useMediaLibraryPermissions();

  const verifyPermissions = async () => {
    if (cameraPermission?.status === PermissionStatus.UNDETERMINED) {
      const { granted } = await requestPermission();
      return granted;
    }

    if (cameraPermission?.status === PermissionStatus.DENIED) {
      Alert.alert(
        'Insufficient permissions',
        'You need to grant Image Gallery permissions to use this app. Please, go to Settings and grant permissions.',
      );
      return false;
    }

    return true;
  };

  const getImageHandler = async () => {
    const status = await verifyPermissions();
    if (!status) return;

    const { canceled, assets } = await launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1], // square
      quality: 0.8,
    });
    if (canceled) return;

    const [{ uri, fileSize = 0 }] = assets;
    if (fileSize > 10485760) {
      // 10485760 - backend (Cloudinary) limit
      showToast(
        ToastType.ERROR,
        'Image size is too big',
        'Please, choose another one.',
      );
      return;
    }
    setImage(uri);
  };
  return (
    <Pressable
      onPress={getImageHandler}
      style={({ pressed }) => [pressed ? { opacity: 0.5 } : {}, styles.button]}
      disabled={disabled}
    >
      {image ? (
        <PickedImage source={{ uri: image }} />
      ) : (
        <Svg width="266" height="266" viewBox="0 0 104 104">
          <Path
            d="M52 26C48.786 26 45.6443 26.953 42.972 28.7386C40.2997 30.5242 38.2169 33.0621 36.9869 36.0314C35.757 39.0007 35.4352 42.268 36.0622 45.4202C36.6892 48.5724 38.2369 51.4679 40.5095 53.7405C42.7821 56.0131 45.6776 57.5608 48.8298 58.1878C51.982 58.8148 55.2493 58.493 58.2186 57.263C61.1879 56.0331 63.7258 53.9503 65.5114 51.278C67.297 48.6057 68.25 45.4639 68.25 42.25C68.25 37.9402 66.5379 33.807 63.4905 30.7595C60.443 27.712 56.3098 26 52 26ZM52 52C50.0716 52 48.1866 51.4282 46.5832 50.3568C44.9798 49.2855 43.7301 47.7627 42.9922 45.9812C42.2542 44.1996 42.0611 42.2392 42.4373 40.3479C42.8135 38.4566 43.7421 36.7193 45.1057 35.3557C46.4693 33.9921 48.2065 33.0635 50.0979 32.6873C51.9892 32.3111 53.9496 32.5042 55.7312 33.2422C57.5127 33.9801 59.0355 35.2298 60.1068 36.8332C61.1782 38.4366 61.75 40.3216 61.75 42.25C61.7474 44.8351 60.7194 47.3135 58.8914 49.1414C57.0635 50.9694 54.5851 51.9974 52 52Z"
            fill="#63ACE5"
          />
          <Path
            d="M52 6.5C43.001 6.5 34.204 9.16853 26.7216 14.1681C19.2391 19.1677 13.4073 26.2739 9.96349 34.5879C6.5197 42.9019 5.61865 52.0505 7.37427 60.8766C9.1299 69.7027 13.4634 77.8101 19.8266 84.1734C26.1899 90.5367 34.2973 94.8701 43.1234 96.6257C51.9495 98.3814 61.0981 97.4803 69.4121 94.0365C77.7261 90.5927 84.8323 84.7609 89.8319 77.2785C94.8315 69.796 97.5 60.9991 97.5 52C97.4862 39.9369 92.6881 28.3718 84.1582 19.8418C75.6282 11.3119 64.0631 6.51376 52 6.5ZM32.5 85.7253V81.25C32.5026 78.6649 33.5306 76.1865 35.3586 74.3586C37.1865 72.5306 39.6649 71.5026 42.25 71.5H61.75C64.3351 71.5026 66.8135 72.5306 68.6414 74.3586C70.4694 76.1865 71.4974 78.6649 71.5 81.25V85.7253C65.5823 89.1807 58.8527 91.0016 52 91.0016C45.1473 91.0016 38.4177 89.1807 32.5 85.7253ZM77.974 81.0095C77.9092 76.7466 76.1724 72.6797 73.1377 69.6852C70.103 66.6906 66.0134 65.008 61.75 65H42.25C37.9866 65.008 33.897 66.6906 30.8623 69.6852C27.8276 72.6797 26.0908 76.7466 26.026 81.0095C20.1323 75.7469 15.9761 68.8183 14.1077 61.1412C12.2393 53.464 12.7468 45.4004 15.5631 38.018C18.3793 30.6357 23.3715 24.2829 29.8785 19.8008C36.3855 15.3188 44.1004 12.9188 52.0016 12.9188C59.9029 12.9188 67.6178 15.3188 74.1248 19.8008C80.6318 24.2829 85.6239 30.6357 88.4402 38.018C91.2564 45.4004 91.764 53.464 89.8955 61.1412C88.0271 68.8183 83.8709 75.7469 77.9773 81.0095H77.974Z"
            fill="#63ACE5"
          />
        </Svg>
      )}
    </Pressable>
  );
};

export default LogoPicker;
