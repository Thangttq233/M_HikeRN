
// App.js
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { initDb } from './src/db/init';
import HikeListScreen from './src/screens/HikeListScreen';
import HikeFormScreen from './src/screens/HikeFormScreen';
import HikeDetailScreen from './src/screens/HikeDetailScreen';
import ObservationFormScreen from './src/screens/ObservationFormScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [ready, setReady] = useState(false);

  
useEffect(() => {
  (async () => {
    try {
      console.log('[DB] init start');
      await initDb();
      console.log('[DB] init done');
    } catch (e) {
      console.log('[DB] init error', e);
    } finally {
      setReady(true);
    }
  })();
}, []);


  if (!ready) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator> 
        <Stack.Screen name="HikeList" component={HikeListScreen} options={{ title: 'M‑Hike' }} />
        <Stack.Screen name="HikeForm" component={HikeFormScreen} options={{ title: 'Add / Edit Hike' }} />
        <Stack.Screen name="HikeDetail" component={HikeDetailScreen} options={{ title: 'Hike Details' }} />
        <Stack.Screen name="ObservationForm" component={ObservationFormScreen} options={{ title: 'Add Observation' }} />
        {/* <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search Hikes' }} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
