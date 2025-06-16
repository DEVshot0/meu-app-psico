import React from 'react';
import { View, Text, TextInput, Image, StyleSheet } from 'react-native';

const UserProfileCard = ({ isEditing, formData, setFormData, userData }) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: isEditing ? formData.profile_pic : userData.profile_pic }}
        style={styles.image}
        onError={() =>
          setFormData({ ...formData, profile_pic: 'https://i.pravatar.cc/300' })
        }
      />
      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nome Completo"
            value={formData.full_name}
            onChangeText={(text) => setFormData({ ...formData, full_name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="URL da Foto"
            value={formData.profile_pic}
            onChangeText={(text) => setFormData({ ...formData, profile_pic: text })}
          />
        </>
      ) : (
        <>
          <Text style={styles.name}>{userData.full_name}</Text>
          <Text style={styles.email}>{userData.email}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#2f6b5e'
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff'
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2f6b5e',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
});

export default UserProfileCard;
