import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export function Welcome() {
    const navigation = useNavigation<any>();

    return(
     <View style={styles.container}>
        <Text style={styles.title}>Aluguel de Carros</Text>
        <Text style={styles.subtitle}>
            Bem-vindo ao sistema de controle de aluguel de carros. Utilize os botões abaixo para navegar.
        </Text>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#FF9800' }]} onPress={() => navigation.navigate("FormScreen")}>
            <Text style={styles.buttonText}>Novo Aluguel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#2196F3' }]} onPress={() => navigation.navigate("ListScreen")}>
            <Text style={styles.buttonText}>Ver Aluguéis</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#9C27B0' }]} onPress={() => navigation.navigate("Drawer")}>
            <Text style={styles.buttonText}>Modais e Listas (Prática 01)</Text>
        </TouchableOpacity>
     </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 30,
        lineHeight: 22,
    },
    button: {
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});