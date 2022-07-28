//Styled Components
import styled from 'styled-components/native';

//React Native
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    width: 256,
    height: 256,
    borderRadius: 128,
    overflow: 'hidden',
  },
});

export const PickedImage = styled.Image`
  width: 100%;
  height: 100%;
`;
