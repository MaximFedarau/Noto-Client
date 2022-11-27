import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>; // for navigation object (React Navigation)
export type AvatarPickerRouteProp = RouteProp<
  AuthNavigationRootStackParamList,
  NavigationAuthName.AVATAR_PICKER
>; // for route object (React Navigation) - Avatar Picker screen
export type NotesManagingRouteProp = RouteProp<
  RootStackParamList,
  NavigationName.NOTES_MANAGING
>; // for route object (React Navigation) - Notes Managing screen

type RootStackParamList = {
  [NavigationName.NOTES_OVERVIEW]?: undefined;
  [NavigationName.NOTES_MANAGING]?: {
    draftId?: string;
    noteId?: string;
  };
  [NavigationName.AUTH]: undefined;
} & AuthNavigationRootStackParamList &
  NotesRootStackParamList;

type AuthNavigationRootStackParamList = {
  [NavigationAuthName.SIGN_IN]: undefined;
  [NavigationAuthName.SIGN_UP]: undefined;
  [NavigationAuthName.AVATAR_PICKER]: { id: string };
};

type NotesRootStackParamList = {
  [NavigationNotesName.NOTES]?: undefined;
  [NavigationNotesName.DRAFTS]?: undefined;
};

export enum NavigationName {
  AUTH = 'Auth',
  NOTES_OVERVIEW = 'NotesOverview',
  NOTES_MANAGING = 'NotesManaging',
}

export enum NavigationNotesName {
  NOTES = 'Notes',
  DRAFTS = 'Drafts',
}

export enum NavigationAuthName {
  SIGN_IN = 'SignIn',
  SIGN_UP = 'SignUp',
  AVATAR_PICKER = 'AvatarPicker',
}
