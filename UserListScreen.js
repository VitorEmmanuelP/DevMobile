import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons'; // Ícones nativos do Expo

export default function UserListScreen({ navigation }) {
    const [users, setUsers] = useState([]);
    const [expandedUserId, setExpandedUserId] = useState(null);
    const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Busca usuários no Firestore
    const fetchUsers = async () => {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(userList);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleDetails = (id) => {
        setExpandedUserId(expandedUserId === id ? null : id);
    };

    const confirmDelete = (user) => {
        setUserToDelete(user);
        setModalDeleteVisible(true);
    };

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, 'users', userToDelete.id));
            setModalDeleteVisible(false);
            fetchUsers(); // Atualiza a lista
        } catch (error) {
            Alert.alert("Erro", "Não foi possível excluir o usuário.");
        }
    };

    const renderUser = ({ item }) => (
        <View style={styles.userCard}>
            <View style={styles.userMainRow}>
                <Text style={styles.userName}>{item.name}</Text>
                <View style={styles.iconGroup}>
                    <TouchableOpacity onPress={() => toggleDetails(item.id)}>
                        <Ionicons name={expandedUserId === item.id ? "eye" : "eye-off"} size={24} color="#555" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('EditUser', { userData: item })}>
                        <Ionicons name="pencil" size={24} color="#007bff" style={{ marginHorizontal: 15 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => confirmDelete(item)}>
                        <Ionicons name="trash" size={24} color="#dc3545" />
                    </TouchableOpacity>
                </View>
            </View>

            {expandedUserId === item.id && (
                <View style={styles.detailsBox}>
                    <Text>E-mail: {item.email}</Text>
                    <Text>Nascimento: {item.birthDate}</Text>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                keyExtractor={item => item.id}
                renderItem={renderUser}
            />

            {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
            <Modal visible={modalDeleteVisible} transparent animationType="slide">
                <View style={styles.modalBg}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
                        <Text>Deseja realmente excluir {userToDelete?.name}?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => setModalDeleteVisible(false)} style={styles.cancelBtn}>
                                <Text>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
                                <Text style={{ color: '#fff' }}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10 },
    userCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
    userMainRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    userName: { fontSize: 18, fontWeight: 'bold' },
    iconGroup: { flexDirection: 'row' },
    detailsBox: { marginTop: 10, padding: 10, backgroundColor: '#eee', borderRadius: 5 },
    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '80%', backgroundColor: '#fff', padding: 20, borderRadius: 10 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 },
    cancelBtn: { padding: 10, marginRight: 10 },
    deleteBtn: { backgroundColor: '#dc3545', padding: 10, borderRadius: 5 }
});