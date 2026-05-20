import React from 'react'
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type Props = {
  visible: boolean
  tipo: 'sucesso' | 'erro' | ''
  mensagem: string
  onClose: () => void
}

export default function FeedbackModal({ visible, tipo, mensagem, onClose }: Props) {
  const isSuccess = tipo === 'sucesso'
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Ionicons name={isSuccess ? 'checkmark-circle' : 'close-circle'} size={64} color={isSuccess ? '#16a34a' : '#dc2626'} />
          <Text style={styles.message}>{mensagem}</Text>
          <TouchableOpacity style={[styles.button, isSuccess ? styles.buttonSuccess : styles.buttonError]} onPress={onClose}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  box: { backgroundColor: '#fff', borderRadius: 12, padding: 24, width: '100%', alignItems: 'center' },
  message: { marginTop: 12, fontSize: 16, color: '#334155', textAlign: 'center' },
  button: { marginTop: 18, paddingVertical: 10, paddingHorizontal: 28, borderRadius: 10 },
  buttonSuccess: { backgroundColor: '#16a34a' },
  buttonError: { backgroundColor: '#dc2626' },
  buttonText: { color: '#fff', fontWeight: '700' },
})
