import React, { useEffect, useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import { profileServices } from '../../services/profileService';
import { globalStyles } from '../../constants/globalStyles';
import OwnerCandidate from './components/OwnerCandidate';
import OwnerEmployer from './components/OwnerEmployer';
import { useIsFocused } from '@react-navigation/native';
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const { user: currentUser } = useContext(AuthContext);
  const isCandidate = currentUser?.role === 'CANDIDATE';

  const { data: profile, loading, execute: fetchProfile } = useApi(
    isCandidate ? profileServices.getPublicCandidateProfile : profileServices.getPublicEmployerProfile
  );

  useEffect(() => {
    if (currentUser?.username) fetchProfile(currentUser.username);
  }, [currentUser?.username,isFocused]);

  if (loading || !profile) {
    return (
      <View style={[globalStyles.container, globalStyles.centerAll]}>
        <ActivityIndicator size="large" color="#111111" />
      </View>
    );
  }

  return isCandidate ? (
    <OwnerCandidate profile={profile} insets={insets} isFocused={isFocused} />
  ) : (
    <OwnerEmployer profile={profile} insets={insets} isFocused={isFocused} />
  );
}