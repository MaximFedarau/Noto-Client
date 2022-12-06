import React, { FC } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props extends TouchableOpacityProps {
  iconName: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
}

const IconButton: FC<Props> = ({ iconName, size, color, ...props }) => (
  <TouchableOpacity {...props} activeOpacity={0.8}>
    <Ionicons name={iconName} size={size} color={color} />
  </TouchableOpacity>
);

export default IconButton;
