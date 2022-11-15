import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

import {
  NAVIGATION_NAMES,
  NAVIGATION_NOTES_NAMES,
  NAVIGATION_AUTH_NAMES,
  SOCKET_NOTE_STATUSES,
} from './enum';

// ! Navigation Props

// All Auth routes
type AuthNavigationRootStackParamList = {
  [NAVIGATION_AUTH_NAMES.SIGN_IN]: undefined;
  [NAVIGATION_AUTH_NAMES.SIGN_UP]: undefined;
  [NAVIGATION_AUTH_NAMES.AVATAR_PICKER]: { id: string };
};

// All Notes/Drafts routes
type NotesRootStackParamList = {
  [NAVIGATION_NOTES_NAMES.NOTES]?: undefined;
  [NAVIGATION_NOTES_NAMES.DRAFTS]?: undefined;
};

// General routes
type RootStackParamList = {
  [NAVIGATION_NAMES.NOTES_OVERVIEW]?: undefined;
  [NAVIGATION_NAMES.NOTES_MANAGING]?: {
    draftId?: string;
    noteId?: string;
  };
  [NAVIGATION_NAMES.AUTH]: undefined;
} & AuthNavigationRootStackParamList &
  NotesRootStackParamList;

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>; // for navigation object (React Navigation)
export type AvatarPickerRouteProp = RouteProp<
  AuthNavigationRootStackParamList,
  NAVIGATION_AUTH_NAMES.AVATAR_PICKER
>; // for route object (React Navigation) - Avatar Picker screen
export type NotesManagingRouteProp = RouteProp<
  RootStackParamList,
  NAVIGATION_NAMES.NOTES_MANAGING
>; // for route object (React Navigation) - Notes Managing screen

// ! Notes Managing Form Data Interface

// Note/Draft Schema for adding Note/Draft form
export interface NotesManagingFormData {
  title?: string;
  content?: string;
}

// ! Draft Schema

// Draft schema for local DB
export interface DraftSchema {
  id: string;
  date: string;
  title?: string;
  content?: string;
}

// ! Note Schema

export interface NoteSchema {
  id: string;
  date: string;
  title?: string;
  content?: string;
}

// ! Auth Sign In Interface

// Form Interface for Sign In Form
export interface SignInFormData {
  nickname: string;
  password: string;
}

// ! Auth Sign Up Interface

// Form Interface for Sign Up Form
export interface SignUpFormData {
  nickname: string;
  password: string;
  confirmPassword: string;
}

// ! Public User Data Interface

// Public Data (like Avatar, for example) Interface - for fetching, setting as data and etc.
export interface PublicUserData {
  nickname: string;
  isAuth: boolean;
  avatar?: string;
}

// ! Socket Data Interface

export interface SocketNoteData {
  status: SOCKET_NOTE_STATUSES;
  note: NoteSchema;
  isDeleteOrigin?: boolean; // flag for delete handler, which means that answers the question: Does note was deleted from current device?
}

// ! Tokens Interface

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
