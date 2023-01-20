import styled from 'styled-components/native';
import { Platform, StatusBar } from 'react-native';

export const Container = styled.View`
  flex: 1;
  flex-direction: column;
`;

export const ScrollContainer = styled.ScrollView`
  flex: 1;
  flex-direction: column;
`;

export const SafeAreaContainer = styled.SafeAreaView`
  flex: 1;
`;

export const ErrorContainer = styled(Container)`
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.springWood};
`;

export const LoadingContainer = styled(Container)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.springWood};
  align-items: center;
  justify-content: center;
`;

export const RecordsContainer = styled(SafeAreaContainer)`
  justify-content: center;
`;

export const RecordsContent = styled(Container)`
  justify-content: center;
`;

export const AuthScreenContainer = styled(SafeAreaContainer)`
  margin-top: ${({ theme }) =>
    Platform.OS === 'android' ? StatusBar.currentHeight : theme.sizes['2xl']}px;
`;

export const FormContainer = styled(Container)`
  padding-vertical: ${({ theme }) => theme.sizes.lg}px;
  align-items: center;
  flex: none;
`;

export const FormButtonsContainer = styled(Container)`
  margin-top: ${({ theme }) => theme.sizes['4xl']}px;
  align-items: center;
  flex: none;
`;

export const AvatarPickerContainer = styled(Container)`
  justify-content: center;
  align-items: center;
  padding-vertical: ${({ theme }) => theme.sizes.lg}px;
`;
