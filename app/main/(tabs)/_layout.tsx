import Header from '@/components/layout/header';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, router } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      // backBehavior='history'
      screenOptions={{
        header: ({ }) => (<Header title={''} />),
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
          title: 'Novo registro',
          tabBarIcon: () => <FontAwesome size={50} name="plus-circle" color={'#659867'} style={{ zIndex: 1, position: 'absolute' }} />,
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: 'Nova coleção',
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