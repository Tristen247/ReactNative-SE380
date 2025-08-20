// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { FavoritesProvider } from './scannerDemo/context/FavoritesContext'; 
import type { NavigatorScreenParams } from '@react-navigation/native';
import QRScanner from './scannerDemo/scanner/QRScanner';
import ProductDetail from './scannerDemo/scanner/ProductDetail';
import FavoritesScreen from './scannerDemo/favorites/FavoritesScreen';

type ScannerStackParamList = {
  QRScanner: undefined;
  ProductDetail: { url: string };
};
type RootTabParamList = {
  ScannerTab: NavigatorScreenParams<ScannerStackParamList>;
  FavoritesTab: undefined;
};

// --- Navigators ---
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator<RootTabParamList>();
const ScannerStack = createNativeStackNavigator<ScannerStackParamList>();

function ScannerNavigator() {
  return (
    <ScannerStack.Navigator>
      <ScannerStack.Screen name="QRScanner" component={QRScanner} options={{ title: 'Scan' }} />
      <ScannerStack.Screen name="ProductDetail" component={ProductDetail} options={{ title: 'Product' }} />
    </ScannerStack.Navigator>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const icon = route.name === 'ScannerTab' ? 'qr-code-outline' : 'heart-outline';
          return <Ionicons name={icon as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="ScannerTab" component={ScannerNavigator} options={{ title: 'Scanner' }} />
      <Tab.Screen name="FavoritesTab" component={FavoritesScreen} options={{ title: 'Favorites' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <FavoritesProvider> 
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={{ headerShown: false, drawerPosition: 'right', swipeEdgeWidth: 150 }}
        >
          <Drawer.Screen name="Scanner" component={Tabs} />
        </Drawer.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}
