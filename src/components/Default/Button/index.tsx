import React, { FC } from 'react';
import { TouchableOpacityProps, StyleProp, TextStyle } from 'react-native';

import { ButtonType } from '@types';
import { ButtonContainer, ButtonText } from './styles';

interface Props extends TouchableOpacityProps {
  children: string;
  type?: ButtonType;
  textStyle?: StyleProp<TextStyle>;
}

const Button: FC<Props> = ({ children, type, textStyle, ...props }) => (
  <ButtonContainer {...props} type={type} activeOpacity={0.8}>
    <ButtonText style={textStyle} type={type}>
      {children}
    </ButtonText>
  </ButtonContainer>
);

export default Button;
