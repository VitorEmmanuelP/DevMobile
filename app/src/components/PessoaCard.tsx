import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Pessoa } from '../types'
import { COLORS, SPACING, BORDER_RADIUS } from '../constants'

type Props = { pessoa: Pessoa; onPressDetalhes: () => void }

export default function PessoaCard({ pessoa, onPressDetalhes }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPressDetalhes} activeOpacity={0.85}>
      <View style={styles.row}>
        <Text style={styles.name}>{pessoa.nome}</Text>
        <Ionicons name="chevron-forward" size={20} color={COLORS.text.disabled} />
      </View>
      <Text style={styles.info}>{pessoa.idade ?? '-'} anos</Text>
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
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  info: {
    color: COLORS.text.secondary,
    marginTop: SPACING.md,
    fontSize: 14,
    fontWeight: '600',
  },
})
