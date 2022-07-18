//Types
import { ReactElement } from 'react';
import { NavigationProps } from '@app-types/types';

//Constants
import { OSLO_GRAY, SPRING_WOOD, CYBER_YELLOW } from '@constants/colors';
import { NAVIGATION_NAMES } from '@app-types/enum';
import { deleteEmptyDrafts } from '@utils/db/drafts/delete';

//Expo
import { Ionicons } from '@expo/vector-icons';

//Screens
import Notes from '@screens/Notes/Notes.screen';
import NotesManaging from '@screens/NotesManaging/NotesManaging.screen';
import Drafts from '@screens/Drafts/Drafts.screen';

//Components
import IconButton from '@components/Default/IconButton/IconButton.component';
import { Pressable } from 'react-native';

import { RightHeaderView } from '@components/Default/View/View.component';

//React Navigation
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const BottomTab = createBottomTabNavigator();

export default function MainBottomTabs(): ReactElement {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerTintColor: OSLO_GRAY,
        headerTitleStyle: {
          fontFamily: 'Roboto-Regular',
        },
        headerStyle: { backgroundColor: SPRING_WOOD },
        headerShadowVisible: false,
        tabBarStyle: { backgroundColor: SPRING_WOOD, justifyContent: 'center' },
        tabBarActiveTintColor: CYBER_YELLOW,
      }}
      sceneContainerStyle={{
        backgroundColor: SPRING_WOOD,
      }}
    >
      <BottomTab.Screen
        name={NAVIGATION_NAMES.NOTES}
        component={Notes}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="document" size={size} color={color} />;
          },
          tabBarLabel: () => null,
          headerRight: ({ tintColor }) => {
            return (
              <RightHeaderView>
                <IconButton iconName="person" size={32} color={tintColor} />
              </RightHeaderView>
            );
          },
          title: 'Notes',
        }}
      />
      <BottomTab.Screen
        name={NAVIGATION_NAMES.NOTES_MANAGING}
        component={NotesManaging}
        options={({ navigation }: { navigation: NavigationProps }) => ({
          title: 'Manage Note',
          headerTitleAlign: 'center',
          headerTintColor: OSLO_GRAY,
          headerTitleStyle: {
            fontFamily: 'Roboto-Regular',
          },
          headerStyle: { backgroundColor: SPRING_WOOD },
          headerShadowVisible: false,
          unmountOnBlur: true,
          tabBarLabel: () => null,
          tabBarIcon: ({ color, size }) => {
            return (
              <Ionicons name="add-circle-sharp" size={size} color={color} />
            );
          },
          tabBarButton: (props) => {
            function onButtonClickHandler() {
              navigation.navigate(NAVIGATION_NAMES.NOTES_MANAGING);
            }
            return <Pressable {...props} onPress={onButtonClickHandler} />;
          },
        })}
      />
      <BottomTab.Screen
        name={NAVIGATION_NAMES.DRAFTS}
        component={Drafts}
        options={({ navigation }: { navigation: NavigationProps }) => ({
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="archive" size={size} color={color} />;
          },
          tabBarLabel: () => null,
          headerRight: ({ tintColor }) => {
            return (
              <RightHeaderView>
                <IconButton iconName="person" size={32} color={tintColor} />
              </RightHeaderView>
            );
          },
          title: 'Loading...',
          tabBarButton: (props) => {
            async function onButtonClickHandler() {
              await deleteEmptyDrafts()
                .then(() => {
                  navigation.navigate(NAVIGATION_NAMES.DRAFTS);
                })
                .catch((error) => {
                  console.log(error, 'deleting empty drafts');
                });
            }
            return <Pressable {...props} onPress={onButtonClickHandler} />;
          },
        })}
      />
    </BottomTab.Navigator>
  );
}
