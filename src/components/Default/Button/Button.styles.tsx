import styled from 'styled-components/native';
import { Pressable } from 'react-native';

import { ButtonType } from '@types';
import { BUNTING } from '@constants/colors';

//Interface for Props
interface ButtonStylingProps {
  type?: ButtonType;
}

export const ButtonContainer = styled(Pressable)<ButtonStylingProps>`
  display: flex;
  justify-content: center;
  background-color: ${({ type }) =>
    type === ButtonType.CONTAINED ? BUNTING : 'transparent'};
  border: ${({ type }) =>
    type === ButtonType.CONTAINED ? '' : `2px solid ${BUNTING}`};
  align-self: center;
  width: 60%;
  height: 32px;
  border-radius: 20px;
`;

export const ButtonText = styled.Text<ButtonStylingProps>`
  color: ${({ type }) => (type === ButtonType.CONTAINED ? 'white' : BUNTING)};
  font-size: 16px;
  text-align: center;
`;
