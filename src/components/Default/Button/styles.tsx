import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';

import { ButtonType } from '@types';

interface Props {
  type?: ButtonType;
}

export const ButtonContainer = styled(TouchableOpacity)<Props>`
  display: flex;
  justify-content: center;
  background-color: ${({ type, theme }) =>
    type === ButtonType.CONTAINED ? theme.colors.bunting : 'transparent'};
  border: ${({ type, theme }) =>
    type === ButtonType.CONTAINED ? '' : `2px solid ${theme.colors.bunting}`};
  align-self: center;
  width: 60%;
  height: ${({ theme }) => theme.sizes['4xl']}px;
  border-radius: ${({ theme }) => theme.sizes.xl}px;
`;

export const ButtonText = styled.Text<Props>`
  color: ${({ type, theme }) =>
    type === ButtonType.CONTAINED ? theme.colors.white : theme.colors.bunting};
  font-size: ${({ theme }) => theme.fonts.sizes.lg}px;
  text-align: center;
`;
