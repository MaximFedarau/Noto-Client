//Types
import { BUTTON_TYPES } from '@app-types/enum';

//Constants
import { BUNTING } from '@constants/colors';

//Styled Components
import styled from 'styled-components/native';

//React Native
import { Pressable } from 'react-native';

//Interface for Props
interface ButtonStylingProps {
  type?: BUTTON_TYPES;
}

export const ButtonContainer = styled(Pressable)<ButtonStylingProps>`
  display: flex;
  justify-content: center;
  background-color: ${({ type }) =>
    type === BUTTON_TYPES.CONTAINED ? BUNTING : 'transparent'};
  border: ${({ type }) =>
    type === BUTTON_TYPES.CONTAINED ? '' : `2px solid ${BUNTING}`};
  align-self: center;
  width: 60%;
  height: 32px;
  border-radius: 20px;
`;

export const ButtonText = styled.Text<ButtonStylingProps>`
  color: ${({ type }) => (type === BUTTON_TYPES.CONTAINED ? 'white' : BUNTING)};
  font-size: 16px;
  text-align: center;
`;
