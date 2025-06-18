import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

const PremioModal = ({ visible, onClose, onSelect }) => {
  const [showInput, setShowInput] = useState(false);
  const [premioText, setPremioText] = useState('');

  const handleSim = () => {
    setShowInput(true);
  };

  const handleConfirm = () => {
    onSelect(premioText); // envia o texto digitado como prêmio
    setShowInput(false);
    setPremioText('');
  };

  const handleNao = () => {
    onSelect(null); // sem prêmio
    setShowInput(false);
    setPremioText('');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Houve prêmio?</Text>

          {!showInput ? (
            <View style={styles.buttons}>
              <TouchableOpacity style={styles.button} onPress={handleSim}>
                <Text style={styles.text}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleNao}>
                <Text style={styles.text}>Não</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ alignItems: 'center', width: '100%' }}>
              <Text style={styles.subtitle}>Qual o prêmio?</Text>
              <TextInput
                style={styles.input}
                placeholder="Descreva o prêmio..."
                value={premioText}
                onChangeText={setPremioText}
              />
              <TouchableOpacity style={[styles.button, { marginTop: 15 }]} onPress={handleConfirm}>
                <Text style={styles.text}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center'
  },
  content: {
    backgroundColor: 'white', padding: 25, borderRadius: 10, alignItems: 'center', width: '80%'
  },
  title: {
    fontSize: 20, fontWeight: 'bold', marginBottom: 20
  },
  subtitle: {
    fontSize: 16, marginBottom: 10, textAlign: 'center'
  },
  buttons: {
    flexDirection: 'row', justifyContent: 'center'
  },
  button: {
    backgroundColor: '#2f6b5e', padding: 15, borderRadius: 10, marginHorizontal: 15
  },
  text: {
    color: 'white', fontWeight: 'bold', fontSize: 16
  },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, width: '100%', textAlign: 'center'
  }
});

export default PremioModal;
