import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../src/config/firebase';

export function FormScreen({ navigation }) {
  const [nomeCarro, setNomeCarro] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [valorAluguel, setValorAluguel] = useState('');
  const [dataAluguel, setDataAluguel] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!nomeCarro || !nomeCliente || !valorAluguel || !dataAluguel) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'alugueis'), {
        nomeCarro,
        nomeCliente,
        valorAluguel: parseFloat(valorAluguel),
        dataAluguel,
        userId: auth.currentUser?.uid || '',
        criadoEm: new Date().toISOString(),
      });

      Alert.alert('Sucesso', 'Aluguel registrado com sucesso!');
      setNomeCarro('');
      setNomeCliente('');
      setValorAluguel('');
      setDataAluguel('');
      navigation.navigate('ListScreen');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao registrar o aluguel. Tente novamente.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Novo Aluguel de Carro</Text>

        <Text style={styles.label}>Nome do Carro</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Fiat Uno"
          value={nomeCarro}
          onChangeText={setNomeCarro}
        />

        <Text style={styles.label}>Nome do Cliente</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: João Silva"
          value={nomeCliente}
          onChangeText={setNomeCliente}
        />

        <Text style={styles.label}>Valor do Aluguel (R$)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 150.00"
          value={valorAluguel}
          onChangeText={setValorAluguel}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Data do Aluguel</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 15/04/2026"
          value={dataAluguel}
          onChangeText={setDataAluguel}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Salvando...' : 'Registrar Aluguel'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scroll: {
    padding: 30,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
