import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PremioModal = ({ visible, onClose, onSelect }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.overlay}>
      <View style={styles.content}>
        <Text style={styles.title}>Houve prêmio?</Text>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={() => onSelect(true)}>
            <Text style={styles.text}>Sim</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => onSelect(false)}>
            <Text style={styles.text}>Não</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center'
  },
  content: {
    backgroundColor: 'white', padding: 25, borderRadius: 10, alignItems: 'center'
  },
  title: {
    fontSize: 20, fontWeight: 'bold', marginBottom: 20
  },
  buttons: {
    flexDirection: 'row', justifyContent: 'center'
  },
  button: {
    backgroundColor: '#2f6b5e', padding: 15, borderRadius: 10, marginHorizontal: 15
  },
  text: {
    color: 'white', fontWeight: 'bold', fontSize: 16
  }
});

export default PremioModal;
