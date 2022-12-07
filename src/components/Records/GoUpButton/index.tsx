import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { styles } from './styles';

interface Props {
  onPress: () => void;
  color?: string;
  iconColor?: string;
}

export const GoUpButton: FC<Props> = ({
  onPress,
  color,
  iconColor = 'white',
}) => (
  <TouchableOpacity
    style={styles(color).container}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Ionicons name="arrow-up" size={24} color={iconColor} />
  </TouchableOpacity>
);
