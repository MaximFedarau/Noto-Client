//Types
import { NAVIGATION_NAMES, NAVIGATION_AUTH_NAMES } from './enum';

//React Navigation
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

// ! Navigation Props
type NavigationRootStackParamList = {
  [NAVIGATION_AUTH_NAMES.SIGN_IN]: undefined;
  [NAVIGATION_AUTH_NAMES.SIGN_UP]: undefined;
};

type NotesRootStackParamList = {
  [NAVIGATION_NAMES.NOTES]?: undefined;
  [NAVIGATION_NAMES.DRAFTS]?: undefined;
  [NAVIGATION_NAMES.NOTES_MANAGING]?: { id?: string };
};

type RootStackParamList = {
  [NAVIGATION_NAMES.NOTES_OVERVIEW]?: undefined;
  [NAVIGATION_NAMES.AUTH]: undefined;
} & NavigationRootStackParamList &
  NotesRootStackParamList;

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
export type NavigationRouteProp = RouteProp<RootStackParamList>;

// ! Notes Managing Form Data Interface
export interface NotesManagingFormData {
  title?: string;
  content?: string;
}

// ! Draft Schema
export interface DraftSchema {
  id: string;
  title?: string;
  content?: string;
}
