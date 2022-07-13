//Types
import { ReactElement } from 'react';
import { ButtonProps as RNButtonProps } from 'react-native';
import { BUTTON_TYPES } from '@app-types/enum';

//Components
import { ButtonContainer, ButtonText } from './Button.styles';

//Interface for Props
interface ButtonProps extends RNButtonProps {
  children: string;
  type?: BUTTON_TYPES;
}

export default function Button({
  children,
  type,
  ...props
}: ButtonProps): ReactElement {
  return (
    <ButtonContainer
      type={type}
      style={({ pressed }) => [pressed ? { opacity: 0.8 } : {}]}
      {...props}
    >
      <ButtonText type={type}>{children}</ButtonText>
    </ButtonContainer>
  );
}
