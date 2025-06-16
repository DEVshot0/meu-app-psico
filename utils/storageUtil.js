import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserData = async () => {
  const data = await AsyncStorage.getItem('userData');
  return data ? JSON.parse(data) : null;
};

export const setUserData = async (data) => {
  await AsyncStorage.setItem('userData', JSON.stringify(data));
};

export const clearUserSession = async () => {
  await AsyncStorage.multiRemove(['authToken', 'userData']);
};
