import React from 'react'
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { Pessoa } from '../../types'
import PessoaCard from '../../components/PessoaCard'
import { useList } from '../../hooks/useApi'
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants'

const PessoaListScreen: React.FC<any> = ({ navigation }) => {
  const { items: pessoas, loading, error, load } = useList<Pessoa>('/api/pessoas')

  useFocusEffect(
    React.useCallback(() => {
      load()
    }, [load])
  )

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pessoas}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <PessoaCard pessoa={item} onPressDetalhes={() => navigation.navigate('PessoaDetail', { id: item.id })} />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma pessoa encontrada</Text>}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('PessoaForm')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  )
}

export default PessoaListScreen

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
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.text.secondary,
    marginTop: SPACING.xxl,
  },
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.xxl,
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
})
