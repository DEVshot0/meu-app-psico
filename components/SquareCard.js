import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SquareCard = ({ iconName, description, onPress }) => {
  // Calcula 30% da largura da tela
  const cardSize = Dimensions.get('window').width * 0.3;

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[styles.container, { width: cardSize, height: cardSize }]}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={cardSize * 0.4} color="white" />
      </View>
      <Text style={styles.description} numberOfLines={2}>{description}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2f6b5e', // Mesmo verde do app
    borderRadius: 12,
    margin: 8,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 5,
  },
});

export default SquareCard;