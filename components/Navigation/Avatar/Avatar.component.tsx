import React, { ReactElement } from 'react';
import { Pressable, Image, ActivityIndicator } from 'react-native';

import { styles } from './Avatar.styles';

// Interface for Props
interface AvatarProps {
  size: number;
  image: string;
  onPress?: () => void;
}

export default function Avatar({
  size,
  image,
  onPress,
}: AvatarProps): ReactElement {
  const [isLoading, setIsLoading] = React.useState(true);

  function onImageLoaded() {
    setIsLoading(false);
  }

  return (
    <Pressable
      style={({ pressed }) => [
        pressed ? { opacity: 0.5 } : {},
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
      onPress={onPress}
    >
      {isLoading && <ActivityIndicator size="small" style={styles.spinner} />}
      <Image
        source={{ uri: image }}
        onLoadEnd={onImageLoaded}
        style={styles.image}
      />
    </Pressable>
  );
}
