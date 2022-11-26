import { ReactElement } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { styles } from './GoUpButton.styles';

//Interface for Props
interface GoUpButtonProps {
  onPress: () => void;
  color?: string;
  iconColor?: string;
}

export default function GoUpButton({
  onPress,
  color,
  iconColor = 'white',
}: GoUpButtonProps): ReactElement {
  return (
    <TouchableOpacity
      style={styles(color).container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Ionicons name="arrow-up" size={24} color={iconColor} />
    </TouchableOpacity>
  );
}
