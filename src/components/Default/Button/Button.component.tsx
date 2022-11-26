import { ReactElement } from 'react';
import { PressableProps, StyleProp, TextStyle } from 'react-native';

import { BUTTON_TYPES } from '@app-types/enum';
import { ButtonContainer, ButtonText } from './Button.styles';

//Interface for Props
interface ButtonProps extends PressableProps {
  children: string;
  type?: BUTTON_TYPES;
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
