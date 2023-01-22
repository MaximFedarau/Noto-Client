import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T, string>;
export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;
export type RecordsTabScreenProps<T extends keyof RecordsTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RecordsTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

type RootStackParamList = {
  [NavigationName.RECORDS_OVERVIEW]?: NavigatorScreenParams<RecordsTabParamList>;
  [NavigationName.RECORDS_MANAGING]?: {
    draftId?: string | null;
    noteId?: string | null;
  };
  [NavigationName.AUTH]?: NavigatorScreenParams<AuthStackParamList>;
};

type AuthStackParamList = {
  [NavigationAuthName.SIGN_IN]: undefined;
  [NavigationAuthName.SIGN_UP]: undefined;
  [NavigationAuthName.AVATAR_PICKER]: { id: string }; // required param
};

type RecordsTabParamList = {
  [NavigationRecordsName.NOTES]: undefined;
  [NavigationRecordsName.DRAFTS]: undefined;
};

export enum NavigationName {
  AUTH = 'Auth',
  RECORDS_OVERVIEW = 'RecordsOverview',
  RECORDS_MANAGING = 'RecordsManaging',
}

export enum NavigationRecordsName {
  NOTES = 'Notes',
  DRAFTS = 'Drafts',
}

export enum NavigationAuthName {
  SIGN_IN = 'SignIn',
  SIGN_UP = 'SignUp',
  AVATAR_PICKER = 'AvatarPicker',
}

export const MAIN_NAVIGATOR_ID = 'MainNavigator';
