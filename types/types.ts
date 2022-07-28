//Types
import {
  NAVIGATION_NAMES,
  NAVIGATION_NOTES_NAMES,
  NAVIGATION_AUTH_NAMES,
} from './enum';

//React Navigation
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

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
  [NAVIGATION_NOTES_NAMES.NOTES_MANAGING]?: { id?: string };
};

// General routes
type RootStackParamList = {
  [NAVIGATION_NAMES.NOTES_OVERVIEW]?: undefined;
  [NAVIGATION_NAMES.AUTH]: undefined;
} & AuthNavigationRootStackParamList &
  NotesRootStackParamList;

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>; // for navigation object (React Navigation)
export type NavigationRouteProp = RouteProp<RootStackParamList>; // for route object (React Navigation)

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
  avatar?: string;
}
