//Types
import { ReactElement } from 'react';

//Constants
import { OSLO_GRAY, SPRING_WOOD, CYBER_YELLOW } from '../../constants/colors';
import { NAVIGATION_NAMES } from '../../constants/data';

//Expo
import { Ionicons } from '@expo/vector-icons';

//Screens
import Notes from '../../screens/Notes/Notes.screen';
import Drafts from '../../screens/Drafts/Drafts.screen';

//Components
import IconButton from '../../components/Default/IconButton/IconButton.component';

import {
  RightHeaderView,
  LeftHeaderView,
} from '../../components/Default/View/View.component';

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
        headerRight: ({ tintColor }) => {
          return (
            <RightHeaderView>
              <IconButton
                iconName="person"
                size={32}
                color={tintColor}
                style={{ marginRight: 12 }}
              />
            </RightHeaderView>
          );
        },
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
          tabBarIcon: ({ color }) => {
            return <Ionicons name="document" size={32} color={color} />;
          },
          tabBarLabel: () => null,
          headerLeft: ({ tintColor }) => {
            return (
              <LeftHeaderView>
                <IconButton iconName="add" size={32} color={tintColor} />
              </LeftHeaderView>
            );
          },
          title: 'Notes',
        }}
      />
      <BottomTab.Screen
        name={NAVIGATION_NAMES.DRAFTS}
        component={Drafts}
        options={{
          tabBarIcon: ({ color }) => {
            return <Ionicons name="archive" size={32} color={color} />;
          },
          tabBarLabel: () => null,
          title: 'Drafts',
        }}
      />
    </BottomTab.Navigator>
  );
}
