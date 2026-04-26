import { useState } from "react";
import { Text } from "react-native-paper";
import { TouchableOpacity, View } from "react-native";

import { globalStyles } from "../../../constants/globalStyles";
import { styles } from "./style"; // Import style tái chế
import { AppScreenWrapper } from "../../../components/AppScreenWrapper";
import { AppInput } from "../../../components/AppInput";
import { AppButton } from "../../../components/AppButton";
import { APP_NAME } from "../../../constants/config";

export const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AppScreenWrapper>
      <View style={globalStyles.centerAll,globalStyles.content}>
        
        {/* ======== HEADER ======== */}
        <View style={styles.headerContainer}> 
          <Text style={styles.title}>{APP_NAME}</Text>
          <Text style={styles.subtitle}>Đăng nhập để tiếp tục</Text>
        </View>

        {/* ======== FORM ======== */}
        <View style={styles.formContainer}> 
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

          <TouchableOpacity style={styles.forgotPasswordWrap} onPress={() => console.log('reset password handle here !')}>
            <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <AppButton title="Đăng Nhập" onPress={() => console.log('login handle here !')} />
        </View>

        {/* ======== FOOTER ======== */}
        <View style={globalStyles.rowCenter}>
          <Text style={styles.subtitle}>Bạn chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => console.log('register handle here !')}>
            <Text style={styles.registerText}>Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    </AppScreenWrapper>
  );
};