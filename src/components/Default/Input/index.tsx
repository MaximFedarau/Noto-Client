import styled from 'styled-components/native';
import { TextInput } from 'react-native';

export const DefaultInput = styled(TextInput)`
  background-color: white;
  color: black;
`;

export const AuthInput = styled(DefaultInput)`
  min-width: 90%;
  height: 48px;
  padding: 12px;
  margin-vertical: 8px;
  border-radius: 24px;
  font-size: 18px;
`;

export const SearchBarInput = styled(DefaultInput)`
  font-size: 16px;
  height: 100%;
  width: 100%;
  border-radius: 10px;
  padding: 8px;
`;
