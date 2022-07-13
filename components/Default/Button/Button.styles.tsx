//Types
import { BUTTON_TYPES } from '@app-types/enum';

//Styled Components
import styled from 'styled-components/native';

//Interface for Props
interface ButtonStylingProps {
  type?: BUTTON_TYPES;
}

export const ButtonContainer = styled.Pressable<ButtonStylingProps>`
  display: flex;
  justify-content: center;
  background-color: ${({ type }) =>
    type === BUTTON_TYPES.CONTAINED ? '#0d1137' : 'transparent'};
  border: ${({ type }) =>
    type === BUTTON_TYPES.CONTAINED ? '' : '2px solid #0d1137'};
  align-self: center;
  width: 60%;
  height: 32px;
  border-radius: 20px;
`;

export const ButtonText = styled.Text<ButtonStylingProps>`
  color: ${({ type }) =>
    type === BUTTON_TYPES.CONTAINED ? 'white' : '#0d1137'};
  font-size: 16px;
  text-align: center;
`;
