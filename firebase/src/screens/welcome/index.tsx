import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/index';

export default function WelcomeScreen({ navigation }) {
  
  const handleLogout = () => {
    signOut(auth).then(() => {
      navigation.replace('Login');
    }).catch((error) => {
      console.error(error);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bem-vindo!</Text>
      <Text style={styles.emailText}>{auth.currentUser?.email}</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  emailText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});