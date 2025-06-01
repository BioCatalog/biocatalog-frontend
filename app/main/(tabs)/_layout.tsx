import Header from '@/components/layout/header';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      backBehavior='history'
      screenOptions={{
        header: ({ options }) => (<Header title={options.title} />),
        headerTintColor: 'white',
        tabBarActiveTintColor: '#27AE60',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: { backgroundColor: '#C1F4AF' },
        headerStyle: { backgroundColor: 'green' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Catálogos',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="th-list" color={color} />,
        }}
      />
      <Tabs.Screen
        name="newRecord"
        options={{
          title: 'Registrar',
          tabBarIconStyle: { width: 48 },
          tabBarIcon: ({ focused, color }) => <FontAwesome size={48} name={"plus-circle"} color={focused ? color : '#659867'} style={{ marginBottom: 10, height: 48 }} />,
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: 'Coleção',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="bookmark" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Meu Perfil',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}