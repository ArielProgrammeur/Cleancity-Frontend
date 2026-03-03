import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import {Colors} from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          backgroundColor: Colors.white,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ focused }) => <Ionicons name="home" size={24} color="black" />,
        }}
      />
      
      <Tabs.Screen
        name="map"
        options={{
          title: 'Suivi',
          tabBarIcon: ({ focused }) => <Feather name="map" size={24} color="black" />
        }}
      />
      
      <Tabs.Screen
        name="Reports"
        options={{
          title: 'Recompenses',
          tabBarIcon: ({ focused }) => <SimpleLineIcons name="present" size={24} color="black" />,
        }}
      />
      
      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Market',
          tabBarIcon: ({ focused }) => <AntDesign name="shop" size={24} color="black" />,
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused }) => <Ionicons name="person" size={24} color="black" />,
        }}
      />
    </Tabs>
  );
}