import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { DrawerParamList } from './drawerParamList';

//import GalleryStack from './gallery/GalleryStack';
//import WeatherDrawer from './weather/WeatherDrawer';
import ScannerStack from './scannerDemo/ScannerStack';

const Drawer = createDrawerNavigator<DrawerParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator screenOptions={{
        drawerPosition: "right",
        headerShown: false,
        swipeEdgeWidth: 100,
      }}>
        <Drawer.Screen name="scannerDemo" component={ScannerStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
