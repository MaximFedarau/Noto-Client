import { ReactElement } from 'react';
import { Pressable, Image } from 'react-native';

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
  return (
    <Pressable
      style={({ pressed }) => [
        pressed ? { opacity: 0.5 } : {},
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: 'hidden',
        },
      ]}
      onPress={onPress}
    >
      <Image
        source={{ uri: image }}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </Pressable>
  );
}
