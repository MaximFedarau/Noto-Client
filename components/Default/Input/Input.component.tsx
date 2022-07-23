//Styled Components
import styled from 'styled-components/native';

// ! Default

export const DefaultInput = styled.TextInput`
  background-color: white;
  color: black;
`;

// ! Auth Screens
export const AuthInput = styled(DefaultInput)`
  min-width: 90%;
  height: 48px;
  padding: 12px;
  margin-vertical: 8px;
  border-radius: 24px;
  font-size: 18px;
`;
