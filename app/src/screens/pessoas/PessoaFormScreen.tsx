import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { Pessoa, PessoaFormData } from '../../types'
import { pessoaService } from '../../services/pessoaService'
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants'
import { getErrorMessage, validateForm } from '../../utils/formatters'
import FeedbackModal from '../../components/FeedbackModal'

const PessoaFormScreen: React.FC<any> = ({ route, navigation }) => {
  const pessoaId = route.params?.id ?? null
  const editando = pessoaId != null
  const [nome, setNome] = useState('')
  const [idade, setIdade] = useState('')
  const [loading, setLoading] = useState(editando)
  const [salvando, setSalvando] = useState(false)
  const [feedbackVisible, setFeedbackVisible] = useState(false)
  const [feedbackTipo, setFeedbackTipo] = useState<'sucesso' | 'erro' | ''>('')
  const [feedbackMensagem, setFeedbackMensagem] = useState('')

  useEffect(() => {
    if (!editando) return

    const carregarPessoa = async () => {
      try {
        const pessoa = await pessoaService.obterPorId(pessoaId)
        setNome(pessoa.nome)
        setIdade(String(pessoa.idade ?? ''))
      } catch (err) {
        setFeedbackTipo('erro')
        setFeedbackMensagem(getErrorMessage(err))
        setFeedbackVisible(true)
      } finally {
        setLoading(false)
      }
    }

    carregarPessoa()
  }, [editando, pessoaId])

  const salvar = async () => {
    const { valid, errors } = validateForm(
      { nome: nome.trim(), idade: idade.trim() ? Number(idade) : undefined },
      ['nome']
    )

    if (!valid) {
      setFeedbackTipo('erro')
      setFeedbackMensagem(Object.values(errors).join('\n'))
      setFeedbackVisible(true)
      return
    }

    try {
      setSalvando(true)
      const dados: PessoaFormData = {
        nome: nome.trim(),
        idade: idade.trim() ? Number(idade) : undefined,
      }

      if (editando) {
        await pessoaService.atualizar(pessoaId, dados)
        setFeedbackTipo('sucesso')
        setFeedbackMensagem('Pessoa atualizada!')
      } else {
        await pessoaService.criar(dados)
        setFeedbackTipo('sucesso')
        setFeedbackMensagem('Pessoa cadastrada!')
      }

      setFeedbackVisible(true)
    } catch (err) {
      setFeedbackTipo('erro')
      setFeedbackMensagem(getErrorMessage(err))
      setFeedbackVisible(true)
    } finally {
      setSalvando(false)
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

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        value={nome}
        onChangeText={setNome}
        style={styles.input}
        placeholder="Digite o nome da pessoa"
      />

      <Text style={styles.label}>Idade</Text>
      <TextInput
        value={idade}
        onChangeText={setIdade}
        style={styles.input}
        keyboardType="numeric"
        placeholder="Digite a idade"
      />

      <TouchableOpacity
        style={[styles.btn, salvando && styles.btnDisabled]}
        onPress={salvar}
        disabled={salvando}
      >
        <Text style={styles.btnText}>
          {salvando ? 'Salvando...' : editando ? 'Atualizar' : 'Cadastrar'}
        </Text>
      </TouchableOpacity>

      <FeedbackModal
        visible={feedbackVisible}
        tipo={feedbackTipo}
        mensagem={feedbackMensagem}
        onClose={fecharFeedback}
      />
    </View>
  )
}

export default PessoaFormScreen

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
  label: {
    marginTop: SPACING.lg,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btn: {
    marginTop: SPACING.xl,
    backgroundColor: "green",
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
})
