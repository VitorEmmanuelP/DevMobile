import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';

// Importando o deleteUser para a lógica de Rollback
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !birthDate) {
      setModalMessage('Por favor, preencha todos os campos.');
      setIsSuccess(false);
      setModalVisible(true);
      return;
    }

    let userCreated = null;

    try {
      // 1. Cria o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      userCreated = userCredential.user; // Armazena a referência do usuário criado

      // 2. Salva os dados no Firestore Database
      await setDoc(doc(db, 'users', userCreated.uid), {
        name: name,
        email: email,
        birthDate: birthDate,
        createdAt: new Date().toISOString()
      });

      // 3. Tudo ocorreu bem
      setModalMessage('Cadastro realizado com sucesso!');
      setIsSuccess(true);
      setModalVisible(true);

    } catch (error) {
      // 4. Lógica de Rollback (Reversão)
      // Se o usuário foi criado no Auth, mas o Firestore falhou, nós o apagamos.
      if (userCreated && error.code !== 'auth/email-already-in-use') {
        try {
          await deleteUser(userCreated);
        } catch (rollbackError) {
          console.error("Falha ao reverter criação de usuário:", rollbackError);
        }
      }

      setIsSuccess(false);
      
      // Tratamento de mensagens
      if (error.code === 'auth/email-already-in-use') {
        setModalMessage('Este e-mail já está em uso.');
      } else if (error.code === 'auth/weak-password') {
        setModalMessage('A senha deve ter pelo menos 6 caracteres.');
      } else if (error.code === 'permission-denied') {
        setModalMessage('Erro de permissão no Banco de Dados. Verifique as regras do Firestore.');
      } else {
        setModalMessage('Falha ao cadastrar: ' + error.message);
      }
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    if (isSuccess) {
      navigation.goBack(); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Nova Conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Data de Nascimento (DD/MM/AAAA)"
        value={birthDate}
        onChangeText={setBirthDate}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={[styles.modalText, { color: isSuccess ? '#28a745' : '#dc3545' }]}>
              {isSuccess ? 'Sucesso' : 'Erro'}
            </Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            
            <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#28a745', 
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});