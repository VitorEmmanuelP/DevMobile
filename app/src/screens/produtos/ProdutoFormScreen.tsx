import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { Produto, ProdutoFormData } from '../../types'
import { produtoService } from '../../services/produtoService'
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants'
import { getErrorMessage, validateForm } from '../../utils/formatters'
import FeedbackModal from '../../components/FeedbackModal'

const ProdutoFormScreen: React.FC<any> = ({ route, navigation }) => {
  const produtoId = route.params?.id ?? null
  const editando = produtoId != null
  const [nome, setNome] = useState('')
  const [preco, setPreco] = useState('')
  const [loading, setLoading] = useState(editando)
  const [salvando, setSalvando] = useState(false)
  const [feedbackVisible, setFeedbackVisible] = useState(false)
  const [feedbackTipo, setFeedbackTipo] = useState<'sucesso' | 'erro' | ''>('')
  const [feedbackMensagem, setFeedbackMensagem] = useState('')

  useEffect(() => {
    if (!editando) return

    const carregarProduto = async () => {
      try {
        const produto = await produtoService.obterPorId(produtoId)
        setNome(produto.nome)
        setPreco(String(produto.preco ?? ''))
      } catch (err) {
        setFeedbackTipo('erro')
        setFeedbackMensagem(getErrorMessage(err))
        setFeedbackVisible(true)
      } finally {
        setLoading(false)
      }
    }

    carregarProduto()
  }, [editando, produtoId])

  const salvar = async () => {
    const { valid, errors } = validateForm(
      { nome: nome.trim(), preco: parseFloat(preco) },
      ['nome', 'preco']
    )

    if (!valid) {
      setFeedbackTipo('erro')
      setFeedbackMensagem(Object.values(errors).join('\n'))
      setFeedbackVisible(true)
      return
    }

    try {
      setSalvando(true)
      const dados: ProdutoFormData = {
        nome: nome.trim(),
        preco: parseFloat(preco),
      }

      if (editando) {
        await produtoService.atualizar(produtoId, dados)
        setFeedbackTipo('sucesso')
        setFeedbackMensagem('Produto atualizado!')
      } else {
        await produtoService.criar(dados)
        setFeedbackTipo('sucesso')
        setFeedbackMensagem('Produto cadastrado!')
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
        placeholder="Digite o nome do produto"
      />

      <Text style={styles.label}>Preço</Text>
      <TextInput
        value={preco}
        onChangeText={setPreco}
        style={styles.input}
        keyboardType="decimal-pad"
        placeholder="0.00"
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

export default ProdutoFormScreen

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
