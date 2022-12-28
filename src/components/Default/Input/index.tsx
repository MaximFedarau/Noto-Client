import styled from 'styled-components/native';
import { TextInput } from 'react-native';

export const DefaultInput = styled(TextInput)`
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
`;

export const AuthInput = styled(DefaultInput)`
  min-width: 90%;
  height: ${({ theme }) => theme.sizes['8xl']}px;
  padding: ${({ theme }) => theme.sizes.md}px;
  margin-vertical: ${({ theme }) => theme.sizes.sm}px;
  border-radius: ${({ theme }) => theme.sizes['2xl']}px;
  font-size: ${({ theme }) => theme.fonts.sizes.lg}px;
`;

export const SearchBarInput = styled(DefaultInput)`
  font-size: ${({ theme }) => theme.fonts.sizes.base}px;
  height: 100%;
  width: 100%;
  border-radius: ${({ theme }) => theme.sizes.md}px;
  padding: ${({ theme }) => theme.sizes.sm}px;
`;
