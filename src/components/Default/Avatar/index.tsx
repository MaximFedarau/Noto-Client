import React, { FC, useState } from 'react';
import { TouchableOpacity, Image, ActivityIndicator } from 'react-native';

import { getStyles } from './styles';

interface Props {
  size: number;
  image: string;
  onPress?: () => void;
}

export const Avatar: FC<Props> = ({ size, image, onPress }) => {
  const styles = getStyles(size);

  const [isLoading, setIsLoading] = useState(true);

  const onImageLoaded = () => setIsLoading(false);

  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {isLoading && <ActivityIndicator size="small" style={styles.spinner} />}
      <Image
        source={{ uri: image }}
        onLoadEnd={onImageLoaded}
        style={styles.image}
      />
    </TouchableOpacity>
  );
};
