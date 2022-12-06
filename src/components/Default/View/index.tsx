import styled from 'styled-components/native';
import { Platform, StatusBar } from 'react-native';

import { SPRING_WOOD } from '@constants/colors';

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
  background-color: ${SPRING_WOOD};
`;

export const LoadingContainer = styled(Container)`
  flex: 1;
  background-color: ${SPRING_WOOD};
  align-items: center;
  justify-content: center;
`;

export const RightHeader = styled(Container)`
  margin-right: 12px;
  flex: none;
`;

export const LeftHeader = styled(Container)`
  margin-left: 12px;
  flex: none;
`;

export const RecordsManagingRightHeader = styled(RightHeader)`
  margin-right: -4px;
`;

export const RecordsManagingLeftHeader = styled(LeftHeader)`
  margin-left: -8px;
`;

export const RecordsContainer = styled(SafeAreaContainer)`
  justify-content: center;
`;

export const RecordsContent = styled(Container)`
  justify-content: center;
`;

export const AuthScreenContainer = styled(SafeAreaContainer)`
  margin-top: ${Platform.OS === 'android' ? StatusBar.currentHeight : 24}px;
`;

export const FormContainer = styled(Container)`
  padding-vertical: 16px;
  align-items: center;
  flex: none;
`;

export const FormButtonsContainer = styled(Container)`
  margin-top: 32px;
  align-items: center;
  flex: none;
`;

export const AvatarPickerContainer = styled(Container)`
  justify-content: center;
  align-items: center;
  padding-vertical: 16px;
`;
