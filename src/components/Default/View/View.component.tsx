import styled from 'styled-components/native';
import { Platform, StatusBar } from 'react-native';

import { SPRING_WOOD } from '@constants/colors';

// ! Default

export const DefaultView = styled.View`
  flex: 1;
  flex-direction: column;
`;

export const DefaultScrollView = styled.ScrollView`
  flex: 1;
  flex-direction: column;
`;

export const DefaultSafeAreaView = styled.SafeAreaView`
  flex: 1;
`;

// ! Error
export const ErrorView = styled(DefaultView)`
  align-items: center;
  justify-content: center;
  background-color: ${SPRING_WOOD};
`;

// ! Loading
export const LoadingView = styled(DefaultView)`
  flex: 1;
  background-color: ${SPRING_WOOD};
  align-items: center;
  justify-content: center;
`;

// ! App

export const RightHeaderView = styled(DefaultView)`
  margin-right: 12px;
  flex: none;
`;

export const LeftHeaderView = styled(DefaultView)`
  margin-left: 12px;
  flex: none;
`;

// ! Notes Screen

export const NotesView = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
`;

export const NotesContentView = styled(DefaultView)`
  justify-content: center;
`;

// ! Notes Managing Screen

export const FormView = styled(DefaultScrollView)`
  margin-vertical: 16px;
`;

export const NotesManagingRightHeaderView = styled.View`
  margin-right: -4px;
`;

export const NotesManagingLeftHeaderView = styled.View`
  margin-left: -8px;
`;

// ! Drafts Screen

export const DraftsView = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
`;

export const DraftsContentView = styled(DefaultView)`
  justify-content: center;
`;

// ! Auth Screens

export const AuthScreenContainer = styled.SafeAreaView`
  flex: 1;
  margin-top: ${Platform.OS === 'android' ? StatusBar.currentHeight : 24}px;
`;

export const FormContainer = styled.View`
  padding-vertical: 16px;
`;

export const FormContentContainer = styled.View`
  align-items: center;
`;

export const FormFieldsContainer = styled.View``;

export const FormButtonsContainer = styled.View`
  margin-top: 32px;
  align-items: center;
`;

export const AvatarPickerContainer = styled.View`
  justify-content: center;
  align-items: center;
  padding-vertical: 16px;
`;
