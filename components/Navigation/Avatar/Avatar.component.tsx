//Types
import { ReactElement } from 'react';

//React Native
import { Pressable, Image } from 'react-native';

// Interface for Props
interface AvatarProps {
  size: number;
  image: string;
}

export default function Avatar({ size, image }: AvatarProps): ReactElement {
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
