import { ReactElement } from 'react';
import { PressableProps, StyleProp, TextStyle } from 'react-native';

import { ButtonType } from '@types';
import { ButtonContainer, ButtonText } from './Button.styles';

//Interface for Props
interface ButtonProps extends PressableProps {
  children: string;
  type?: ButtonType;
  textStyle?: StyleProp<TextStyle>;
}

export default function Button({
  children,
  type,
  textStyle,
  ...props
}: ButtonProps): ReactElement {
  return (
    <ButtonContainer
      type={type}
      style={({ pressed }) => (pressed ? { opacity: 0.8 } : {})}
      {...props}
    >
      <ButtonText style={textStyle} type={type}>
        {children}
      </ButtonText>
    </ButtonContainer>
  );
}
