import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const screenHeight = Dimensions.get('window').height;
const COLLAPSED_HEIGHT = 120;
const EXPANDED_HEIGHT = screenHeight;

const MainLayout = ({ children, title, navigation, showBackButton = false }) => {
  const animatedHeight = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;
  const isExpanded = useRef(false);

  const toggleCollapse = () => {
    Animated.spring(animatedHeight, {
      toValue: COLLAPSED_HEIGHT,
      useNativeDriver: false,
    }).start(() => {
      isExpanded.current = false;
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        const newHeight = Math.min(EXPANDED_HEIGHT, Math.max(COLLAPSED_HEIGHT, COLLAPSED_HEIGHT + gestureState.dy));
        animatedHeight.setValue(newHeight);
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldExpand = gestureState.dy > 50;
        const shouldCollapse = gestureState.dy < -50;

        if (shouldExpand || (isExpanded.current && !shouldCollapse)) {
          Animated.spring(animatedHeight, {
            toValue: EXPANDED_HEIGHT,
            useNativeDriver: false,
          }).start(() => {
            isExpanded.current = true;
          });
        } else {
          Animated.spring(animatedHeight, {
            toValue: COLLAPSED_HEIGHT,
            useNativeDriver: false,
          }).start(() => {
            isExpanded.current = false;
          });
        }
      },
    })
  ).current;

  const navigateTo = (screenName) => {
    toggleCollapse();
    navigation.navigate(screenName);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2f6b5e" barStyle="light-content" />

      <Animated.View
        style={[styles.greenHeader, { height: animatedHeight }]}
        {...panResponder.panHandlers}
      >
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        )}

        <Animated.View style={[styles.closeButton, {
          opacity: animatedHeight.interpolate({
            inputRange: [COLLAPSED_HEIGHT, COLLAPSED_HEIGHT + 1],
            outputRange: [0, 1],
            extrapolate: 'clamp'
          })
        }]}>
          <TouchableOpacity onPress={toggleCollapse}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.headerTitle}>{title}</Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={styles.optionBox}
            onPress={() => navigateTo('Home')}
          >
            <Ionicons name="apps-outline" size={22} color="white" style={styles.optionIcon} />
            <Text style={styles.optionItem}>Menu Principal</Text>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionBox}
            onPress={() => navigateTo('Configuracoes')}
          >
            <Ionicons name="settings-outline" size={22} color="white" style={styles.optionIcon} />
            <Text style={styles.optionItem}>Configurações</Text>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionBox}
            onPress={() => navigateTo('Historico')}
          >
            <Ionicons name="time-outline" size={22} color="white" style={styles.optionIcon} />
            <Text style={styles.optionItem}>Histórico</Text>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionBox}
            onPress={() => navigateTo('Paciente')}
          >
            <Ionicons name="medical-outline" size={22} color="white" style={styles.optionIcon} />
            <Text style={styles.optionItem}>Paciente</Text>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionBox}
            onPress={() => navigateTo('Profissional')}
          >
            <Ionicons name="people-outline" size={22} color="white" style={styles.optionIcon} />
            <Text style={styles.optionItem}>Profissional</Text>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionBox}
            onPress={() => navigateTo('Planos')}
          >
            <Ionicons name="document-text-outline" size={22} color="white" style={styles.optionIcon} />
            <Text style={styles.optionItem}>Planos</Text>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionBox}
            onPress={() => navigateTo('Relatorios')}
          >
            <Ionicons name="bar-chart-outline" size={22} color="white" style={styles.optionIcon} />
            <Text style={styles.optionItem}>Relatórios</Text>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={styles.whiteBody}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  greenHeader: {
    backgroundColor: '#2f6b5e',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    paddingTop: 20,
    overflow: 'hidden',
  },
  whiteBody: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
    zIndex: 10,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 50,
    zIndex: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 20,
  },
  optionsContainer: {
    marginTop: 20,
    width: '90%',
  },
  optionBox: {
    backgroundColor: '#245247',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionIcon: {
    marginRight: 12,
  },
  optionItem: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
});

export default MainLayout;