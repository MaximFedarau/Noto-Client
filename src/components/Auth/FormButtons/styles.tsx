import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';

import { Button, IconButton } from '@components/Default';
import { FONTS, COLORS } from '@constants';

export const FormSubmitButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.softBlue};
  border: none;
  min-width: 50%;
  height: ${({ theme }) => theme.sizes['6xl']}px;
`;

export const HomeButton = styled(IconButton)`
  background-color: ${({ theme }) => theme.colors.softBlue};
  border-radius: ${({ theme }) => theme.sizes['3xl']}px;
  width: ${({ theme }) => theme.sizes['8xl']}px;
  height: ${({ theme }) => theme.sizes['8xl']}px;
  align-items: center;
  justify-content: center;
  margin-top: ${({ theme }) => theme.sizes.lg}px;
`;

export const styles = StyleSheet.create({
  buttonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes['2xl'],
    fontWeight: 'bold',
  },
});
