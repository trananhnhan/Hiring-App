import { useContext, useState } from "react";
import { Text } from "react-native-paper";
import { TouchableOpacity, View } from "react-native";

import { globalStyles } from "../../../constants/globalStyles";
import { styles } from "./style"; 
import { AppScreenWrapper } from "../../../components/AppScreenWrapper";
import { AppInput } from "../../../components/AppInput";
import { AppButton } from "../../../components/AppButton";
import { APP_NAME } from "../../../constants/config";

import {authServices} from '../../../services/authService';
import { AuthContext } from "../../../context/AuthContext";
import { COLORS } from "../../../constants/theme";
import { useNavigation } from "@react-navigation/native";


export const LoginScreen = () => {
  const navigation = useNavigation();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading,setIsLoading] = useState(false);
  const [errorMessage,setErrorMessage] = useState('');

  const {onLoginSuccess} = useContext(AuthContext);

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage('Vui lòng không bỏ trống username và password. ');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await authServices.login(username,password);
      await onLoginSuccess(data.access_token,data.refresh_token);
    }
    catch( error){
      if (error.response?.data.error_description === "Invalid credentials given.") {
          setErrorMessage('Sai tài khoản hoặc mật khẩu. Vui lòng thử lại!');
      } else {
          setErrorMessage('Lỗi kết nối với máy chủ!');
      }
      console.log('err at login screen: '+error)
      console.log('err detail:', error.response?.data);
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <AppScreenWrapper>
      <View style={[globalStyles.centerAll,globalStyles.content,]}>
        
        {/* header*/}
        <View style={[styles.headerContainer, ]}> 
          <Text style={styles.title}>{APP_NAME}</Text>
          <Text style={styles.subtitle}>Đăng nhập để tiếp tục</Text>
        </View>

        {/* form */}
        <View style={[styles.formContainer, ]}> 
          <AppInput
            label="Username"
            placeholder="Your username..."
            value={username}
            onChangeText={setUsername}
          />

          <AppInput
            label="Password"
            placeholder="Your password..."
            isPassword={true}
            value={password}
            onChangeText={setPassword}
          />

          {errorMessage ? (
            <Text style={{ color: COLORS.error, marginBottom: 10, textAlign: 'center' }}>
              {errorMessage}
            </Text>
          ) : null}

          <View style={[styles.forgotPasswordWrap, ]}>
            <TouchableOpacity  onPress={() => console.log("reset password handle here")}>
              <Text style={styles.forgotPasswordText} >Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>


          <AppButton 
            title="Đăng Nhập" 
            onPress={handleLogin}
            loading = {isLoading}
            disabled = {isLoading}
          />
        </View>

        {/* footer*/}
        <View style={[globalStyles.rowCenter, ]}>
          <Text style={styles.subtitle}>Bạn chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    </AppScreenWrapper>
  );
};