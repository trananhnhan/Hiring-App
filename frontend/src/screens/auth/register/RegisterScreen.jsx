import * as ImagePicker from 'expo-image-picker';
import { useContext, useState } from "react";
import { TouchableOpacity, View, ScrollView, Image } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import { globalStyles } from "../../../constants/globalStyles";
import { styles } from "./style";
import { AppScreenWrapper } from "../../../components/AppScreenWrapper";
import { AppInput } from "../../../components/AppInput";
import { AppButton } from "../../../components/AppButton";
import { APP_NAME } from "../../../constants/config";
import { COLORS } from "../../../constants/theme";
import { authServices } from '../../../services/authService';
import { AuthContext } from '../../../context/AuthContext';

export const RegisterScreen = () => {
    const navigation = useNavigation();
    const { onLoginSuccess } = useContext(AuthContext);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('nhan@gmail.com');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('CANDIDATE');

    const [firstName, setFirstName] = useState('Trần Anh');
    const [lastName, setLastName] = useState('Nhân');
    const [avatar, setAvatar] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    const handlePickAvatar = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Bạn cần cấp quyền truy cập thư viện ảnh để tải avatar lên!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'], // Đổi thành mảng chuỗi thế này
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };
    const handleRegister = async () => {

        if (!username || !email || !password || !confirmPassword || !firstName || !lastName) {
            setErrorMessage('Vui lòng điền đầy đủ các thông tin bắt buộc.');
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage('Mật khẩu xác nhận không khớp.');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('role', role);
            formData.append('first_name', firstName);
            formData.append('last_name', lastName);

            if (avatar) {
                // Trích xuất tên file và định dạng (extension) từ URI
                const localUri = avatar;
                const filename = localUri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image`;

                formData.append('avatar', {
                    uri: localUri,
                    name: filename,
                    type: type,
                });
            }
            await authServices.register(formData);
            const data = await authServices.login(username, password);
            await onLoginSuccess(data.access_token, data.refresh_token);


        } catch (error) {
            setIsLoading(false)
            if (error.response?.status === 400) {
                setErrorMessage('Dữ liệu không hợp lệ hoặc tài khoản đã tồn tại!');
            } else {
                setErrorMessage('Có lỗi xảy ra kết nối với máy chủ.');
            }
            console.log('Lỗi luồng Đăng ký - Đăng nhập:', error);
        }
    };

    return (
        <AppScreenWrapper>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View style={[globalStyles.content, globalStyles.centerAll]}>

                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Tạo Tài Khoản</Text>
                        <Text style={styles.subtitle}>Tham gia cộng đồng {APP_NAME}</Text>
                    </View>

                    <View style={styles.formContainer}>

                        <View style={styles.roleContainer}>
                            <TouchableOpacity
                                style={[styles.roleButton, role === 'CANDIDATE' && styles.roleButtonActive]}
                                onPress={() => setRole('CANDIDATE')}
                                activeOpacity={0.8}
                            >
                                <Text style={role === 'CANDIDATE' ? styles.roleTextActive : styles.roleText}>
                                    Ứng Viên
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.roleButton, role === 'EMPLOYER' && styles.roleButtonActive]}
                                onPress={() => setRole('EMPLOYER')}
                                activeOpacity={0.8}
                            >
                                <Text style={role === 'EMPLOYER' ? styles.roleTextActive : styles.roleText}>
                                    Tuyển Dụng
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* ---> CỤM AVATAR <--- */}
                        <View style={styles.avatarContainer}>
                            <TouchableOpacity
                                onPress={handlePickAvatar}
                                style={styles.avatarItem}
                            >
                                {avatar ? (
                                    <Image source={{ uri: avatar }} style={{ width: '100%', height: '100%' }} />
                                ) : (
                                    <Text style={{ color: COLORS.textSecondary, fontSize: 12 }}>+ Ảnh</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Dùng flex row để Họ và Tên nằm ngang cho gọn */}
                        <View style={[globalStyles.rowBetween, { gap: 10 }]}>
                            <View style={{ flex: 1 }}>
                                <AppInput
                                    label="Họ"
                                    placeholder="VD: Trần Anh..."
                                    value={lastName}
                                    onChangeText={setLastName}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <AppInput
                                    label="Tên"
                                    placeholder="VD: Nhân..."
                                    value={firstName}
                                    onChangeText={setFirstName}
                                />
                            </View>
                        </View>

                        <AppInput
                            label="Username"
                            placeholder="Nhập tên tài khoản..."
                            value={username}
                            onChangeText={setUsername}
                        />

                        <AppInput
                            label="Email"
                            placeholder="name@example.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <AppInput
                            label="Mật khẩu"
                            placeholder="Nhập mật khẩu..."
                            isPassword={true}
                            value={password}
                            onChangeText={setPassword}
                        />

                        <AppInput
                            label="Xác nhận mật khẩu"
                            placeholder="Nhập lại mật khẩu..."
                            isPassword={true}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />

                        {errorMessage ? (
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        ) : null}

                        <AppButton
                            title="Đăng Ký Ngay"
                            onPress={handleRegister}
                            loading={isLoading}
                            disabled={isLoading}
                        />
                    </View>

                    <View style={[globalStyles.rowCenter, styles.loginTextWrap]}>
                        <Text style={styles.subtitle}>Đã có tài khoản? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginText}>Đăng nhập</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </AppScreenWrapper>
    );
};