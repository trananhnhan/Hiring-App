import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "../screens/auth/login/LoginScreen";
import { RegisterScreen } from "../screens/auth/register/RegisterScreen";

const Stack = createNativeStackNavigator();

export const AuthNavigator = () =>{
    return (
        <Stack.Navigator screenOptions={{headerShown : false}}>
            <Stack.Screen name = "Login" component={LoginScreen}/>
            <Stack.Screen name = "Register" component={RegisterScreen}/>
            
        </Stack.Navigator>
    )
}