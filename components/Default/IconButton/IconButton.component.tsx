import { ReactElement } from 'react';
import { PressableProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

//Interface for Props
interface IconButtonProps extends PressableProps {
  iconName: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
}

export default function IconButton({
  iconName,
  size,
  color,
  ...props
}: IconButtonProps): ReactElement {
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [pressed ? { opacity: 0.5 } : {}, props.style]}
    >
      <Ionicons name={iconName} size={size} color={color} />
    </Pressable>
  );
}
