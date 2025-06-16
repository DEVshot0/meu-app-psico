import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const FileUploadSection = ({ attachments = [], isLoadingAttachments = false }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Anexos:</Text>

      {isLoadingAttachments ? (
        <ActivityIndicator color="#2f6b5e" />
      ) : attachments.length > 0 ? (
        attachments.map((item, index) => (
          <Text key={index} style={styles.attachment}>
            {item.attachments?.split('/').pop() || 'Arquivo'}
          </Text>
        ))
      ) : (
        <Text style={styles.emptyText}>Nenhum anexo encontrado.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2f6b5e',
  },
  attachment: {
    fontSize: 14,
    color: '#2f6b5e',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#999',
  },
});

export default FileUploadSection;
