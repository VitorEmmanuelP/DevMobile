import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Produto } from '../types'
import { COLORS, SPACING, BORDER_RADIUS } from '../constants'
import { formatCurrency } from '../utils/formatters'

type Props = { produto: Produto; onPressDetalhes: () => void }

export default function ProdutoCard({ produto, onPressDetalhes }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPressDetalhes} activeOpacity={0.85}>
      <View style={styles.row}>
        <Text style={styles.name}>{produto.nome}</Text>
        <Ionicons name="chevron-forward" size={20} color={COLORS.text.disabled} />
      </View>
      <Text style={styles.price}>{formatCurrency(produto.preco)}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  price: {
    color: COLORS.text.secondary,
    marginTop: SPACING.md,
    fontSize: 14,
    fontWeight: '600',
  },
})
