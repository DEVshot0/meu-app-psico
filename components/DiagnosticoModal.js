import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const DiagnosticoModal = ({ visible, diagnoses, onSelect, onClose }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => onSelect(item)}>
      <Text style={styles.itemText}>{item.diagnosis || `Diagnóstico ${item.id}`}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Selecione o Diagnóstico</Text>
          <FlatList data={diagnoses} renderItem={renderItem} keyExtractor={item => item.id.toString()} />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  content: {
    width: '80%', backgroundColor: 'white',
    borderRadius: 10, padding: 20, maxHeight: '70%'
  },
  title: {
    fontSize: 18, fontWeight: 'bold', marginBottom: 15,
    textAlign: 'center', color: '#2f6b5e'
  },
  item: {
    padding: 15, borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  itemText: {
    fontSize: 16
  },
  closeButton: {
    backgroundColor: '#2f6b5e', padding: 10,
    borderRadius: 5, alignItems: 'center', marginTop: 10
  },
  closeButtonText: {
    color: 'white', fontSize: 16, fontWeight: 'bold'
  }
});

export default DiagnosticoModal;
