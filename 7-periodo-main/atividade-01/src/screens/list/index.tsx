import { useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useFocusEffect } from '@react-navigation/native';

type Aluguel = {
    id: string;
    nomeCarro?: string;
    nomeCliente?: string;
    valorAluguel?: number;
    dataAluguel?: string;
};

export function ListScreen() {
    const [alugueis, setAlugueis] = useState<Aluguel[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    async function fetchAlugueis() {
        try {
            const q = query(collection(db, 'alugueis'), orderBy('criadoEm', 'desc'));
            const snapshot = await getDocs(q);
            const lista: Aluguel[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Aluguel, 'id'>),
            }));
            setAlugueis(lista);
        } catch (error) {
            console.error('Erro ao buscar alugueis:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchAlugueis();
        }, [])
    );

    function onRefresh() {
        setRefreshing(true);
        fetchAlugueis();
    }

    function renderItem({ item }: { item: Aluguel }) {
        return (
            <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.nomeCarro}</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Cliente:</Text>
                    <Text style={styles.value}>{item.nomeCliente}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Valor:</Text>
                    <Text style={styles.value}>R$ {item.valorAluguel?.toFixed(2)}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Data:</Text>
                    <Text style={styles.value}>{item.dataAluguel}</Text>
                </View>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.loadingText}>Carregando alugueis...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Alugueis Cadastrados</Text>
            {alugueis.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Nenhum aluguel cadastrado.</Text>
                </View>
            ) : (
                <FlatList
                    data={alugueis}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        color: '#333',
    },
    list: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2196F3',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: '#555',
        marginRight: 5,
    },
    value: {
        fontSize: 15,
        color: '#333',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
});