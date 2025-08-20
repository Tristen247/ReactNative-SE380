import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { StackParamList } from "./utils/stackParamList";

import Home from "./screens/Home";

const Stack = createNativeStackNavigator<StackParamList>();

const ScannerStack = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
      />
    </Stack.Navigator>
  );
};
export default ScannerStack;