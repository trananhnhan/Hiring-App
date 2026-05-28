import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ModeratorListScreen from '../screens/moderator/ModeratorListScreen';
import ModeratorDetailScreen from '../screens/moderator/ModeratorDetailScreen';

const Stack = createNativeStackNavigator();

export default function ModeratorNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ModeratorListScreen" component={ModeratorListScreen} />
      <Stack.Screen name="ModeratorDetailScreen" component={ModeratorDetailScreen} />
    </Stack.Navigator>
  );
}