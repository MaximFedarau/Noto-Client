import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';

import { ButtonType } from '@types';
import { BUNTING } from '@constants/colors';

interface Props {
  type?: ButtonType;
}

export const ButtonContainer = styled(TouchableOpacity)<Props>`
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

export const ButtonText = styled.Text<Props>`
  color: ${({ type }) => (type === ButtonType.CONTAINED ? 'white' : BUNTING)};
  font-size: 16px;
  text-align: center;
`;
