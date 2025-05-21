// src/App.js
import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  return (
    <>
      <StatusBar backgroundColor="#2f6b5e" barStyle="light-content" />
      <AppNavigator />
    </>
  );
};

export default App;