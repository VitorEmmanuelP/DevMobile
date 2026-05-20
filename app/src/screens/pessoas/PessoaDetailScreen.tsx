import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native'
import { Pessoa } from '../../types'
import { pessoaService } from '../../services/pessoaService'
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants'
import { getErrorMessage } from '../../utils/formatters'
import ConfirmacaoModal from '../../components/ConfirmacaoModal'
import FeedbackModal from '../../components/FeedbackModal'

const PessoaDetailScreen: React.FC<any> = ({ route, navigation }) => {
  const { id } = route.params
  const [pessoa, setPessoa] = useState<Pessoa | null>(null)
  const [loading, setLoading] = useState(true)
  const [deletando, setDeletando] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [feedbackVisible, setFeedbackVisible] = useState(false)
  const [feedbackTipo, setFeedbackTipo] = useState<'sucesso' | 'erro' | ''>('')
  const [feedbackMensagem, setFeedbackMensagem] = useState('')

  useEffect(() => {
    const carregarPessoa = async () => {
      try {
        const data = await pessoaService.obterPorId(id)
        setPessoa(data)
      } catch (err) {
        setFeedbackTipo('erro')
        setFeedbackMensagem(getErrorMessage(err))
        setFeedbackVisible(true)
      } finally {
        setLoading(false)
      }
    }

    carregarPessoa()
  }, [id])

  const deletar = () => {
    setConfirmVisible(true)
  }

  const confirmarExclusao = async () => {
    setConfirmVisible(false)

    try {
      setDeletando(true)
      await pessoaService.deletar(id)
      setFeedbackTipo('sucesso')
      setFeedbackMensagem('Pessoa deletada!')
      setFeedbackVisible(true)
    } catch (err) {
      setFeedbackTipo('erro')
      setFeedbackMensagem(getErrorMessage(err))
      setFeedbackVisible(true)
    } finally {
      setDeletando(false)
    }
  }

  const fecharFeedback = () => {
    setFeedbackVisible(false)
    if (feedbackTipo === 'sucesso') {
      navigation.goBack()
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }

  if (!pessoa) {
    return (
      <View style={styles.center}>
        <Text style={styles.alertIcon}>⚠️</Text>
        <Text style={styles.errorText}>Pessoa não encontrada</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{pessoa.nome}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>ID:</Text>
          <Text style={styles.value}>{pessoa.id}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Idade:</Text>
          <Text style={styles.value}>{pessoa.idade ?? '-'}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('PessoaForm', { id: pessoa.id })}>
          <Text style={styles.iconText}></Text>
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnDanger, deletando && styles.btnDisabled]} onPress={deletar} disabled={deletando}>
          <Text style={styles.iconText}></Text>
          <Text style={styles.btnText}>{deletando ? 'Deletando...' : 'Deletar'}</Text>
        </TouchableOpacity>
      </View>
      <ConfirmacaoModal
        visible={confirmVisible}
        mensagem="Tem certeza que deseja deletar esta pessoa?"
        onCancel={() => setConfirmVisible(false)}
        onConfirm={confirmarExclusao}
      />
      <FeedbackModal
        visible={feedbackVisible}
        tipo={feedbackTipo}
        mensagem={feedbackMensagem}
        onClose={fecharFeedback}
      />
    </View>
  )
}

export default PessoaDetailScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xl,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: 'black',
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: {
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  value: {
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'column',
    gap: SPACING.md,
  },
  btnPrimary: {
    flexDirection: 'row',
    backgroundColor: "green",
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  iconText: {
    marginRight: SPACING.sm,
    fontSize: 16,
  },
  btnDanger: {
    flexDirection: 'row',
    backgroundColor: 'red',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  alertIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLORS.text.secondary,
    marginTop: SPACING.lg,
  },
})
