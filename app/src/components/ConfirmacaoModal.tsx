import React from 'react'
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type Props = {
  visible: boolean
  mensagem: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmacaoModal({ visible, mensagem, onConfirm, onCancel }: Props) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Ionicons name="alert-circle" size={64} color="#f59e0b" />
          <Text style={styles.title}>Atenção</Text>
          <Text style={styles.message}>{mensagem}</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={onCancel}>
              <Text style={styles.textCancel}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnConfirm]} onPress={onConfirm}>
              <Text style={styles.textConfirm}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  box: { backgroundColor: '#fff', borderRadius: 12, padding: 24, width: '100%', alignItems: 'center' },
  title: { marginTop: 8, fontSize: 18, fontWeight: '800', color: '#0f172a' },
  message: { marginTop: 8, color: '#475569', textAlign: 'center' },
  actions: { flexDirection: 'row', marginTop: 16, width: '100%' },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnCancel: { backgroundColor: '#f1f5f9', marginRight: 8 },
  btnConfirm: { backgroundColor: '#dc2626', marginLeft: 8 },
  textCancel: { color: '#475569', fontWeight: '700' },
  textConfirm: { color: '#fff', fontWeight: '700' },
})
