import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export default function EditUserScreen({ route, navigation }) {
  // Recuperamos os dados passados pela navegação
  const { userData } = route.params;

  // Estados apenas para os dados editáveis no Firestore
  const [name, setName] = useState(userData.name);
  const [birthDate, setBirthDate] = useState(userData.birthDate);

  const handleUpdate = async () => {
    // Validação simples
    if (!name || !birthDate) {
      Alert.alert("Erro", "Todos os campos devem ser preenchidos.");
      return;
    }

    try {
      // Referência ao documento específico do usuário no Firestore
      const userRef = doc(db, 'users', userData.id);
      
      // Atualização dos campos de perfil
      await updateDoc(userRef, {
        name: name,
        birthDate: birthDate
      });

      Alert.alert("Sucesso", "Dados de perfil atualizados com sucesso!");
      navigation.goBack(); // Retorna para a lista de usuários
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar os dados no banco de dados.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <Text style={styles.label}>Nome Completo:</Text>
      <TextInput 
        style={styles.input} 
        value={name} 
        onChangeText={setName} 
        placeholder="Digite o nome"
      />

      <Text style={styles.label}>Data de Nascimento:</Text>
      <TextInput 
        style={styles.input} 
        value={birthDate} 
        onChangeText={setBirthDate} 
        placeholder="DD/MM/AAAA"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
        <Text style={styles.updateBtnText}>Salvar Alterações</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.cancelBtn} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelBtnText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center'
  },
  label: { 
    fontWeight: 'bold', 
    marginBottom: 5,
    color: '#555' 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 20,
    fontSize: 16
  },
  updateBtn: { 
    backgroundColor: '#28a745', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center',
    marginTop: 10 
  },
  updateBtnText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  cancelBtn: {
    marginTop: 15,
    alignItems: 'center'
  },
  cancelBtnText: {
    color: '#6c757d',
    fontSize: 14
  }
});