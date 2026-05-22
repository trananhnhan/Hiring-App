import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApi } from '../../hooks/useApi';
import { profileServices } from '../../services/profileService';
import { globalStyles } from '../../constants/globalStyles';
import PublicCandidate from './components/PublicCandidate';
import PublicEmployer from './components/PublicEmployer';

export default function PublicProfileScreen() {
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { username, role } = route.params || {};
  const isCandidate = role === 'CANDIDATE';

  const { data: profile, loading, execute: fetchPublicProfile } = useApi(
    isCandidate ? profileServices.getPublicCandidateProfile : profileServices.getPublicEmployerProfile
  );

  useEffect(() => {
    if (username) fetchPublicProfile(username);
  }, [username]);

  if (loading || !profile) {
    return (
      <View style={[globalStyles.container, globalStyles.centerAll]}>
        <ActivityIndicator size="large" color="#111111" />
      </View>
    );
  }

  return isCandidate ? (
    <PublicCandidate profile={profile} insets={insets} />
  ) : (
    <PublicEmployer profile={profile} insets={insets} />
  );
}