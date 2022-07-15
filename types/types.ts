//Types
import { NAVIGATION_NAMES } from './enum';

//React Navigation
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// ! Navigation Props
type RootStackParamList = {
  [NAVIGATION_NAMES.NOTES]?: undefined;
  [NAVIGATION_NAMES.DRAFTS]?: undefined;
  [NAVIGATION_NAMES.NOTES_OVERVIEW]?: undefined;
  [NAVIGATION_NAMES.NOTES_MANAGING]?: undefined;
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

// ! Notes Managing Form Data Interface
export interface NotesManagingFormData {
  title: string;
  content: string;
}

// ! Draft Schema
export interface DraftSchema {
  id: string;
  title: string;
  content?: string;
}
