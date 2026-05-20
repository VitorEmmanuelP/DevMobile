import 'react-native-gesture-handler'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'

import PessoaListScreen from './src/screens/pessoas/PessoaListScreen'
import PessoaDetailScreen from './src/screens/pessoas/PessoaDetailScreen'
import PessoaFormScreen from './src/screens/pessoas/PessoaFormScreen'
import ProdutoListScreen from './src/screens/produtos/ProdutoListScreen'
import ProdutoDetailScreen from './src/screens/produtos/ProdutoDetailScreen'
import ProdutoFormScreen from './src/screens/produtos/ProdutoFormScreen'

const PessoasStack = createNativeStackNavigator()
const ProdutosStack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function PessoasStackScreen() {
  return (
    <PessoasStack.Navigator>
      <PessoasStack.Screen name="PessoaList" component={PessoaListScreen} options={{ title: 'Pessoas' }} />
      <PessoasStack.Screen name="PessoaDetail" component={PessoaDetailScreen} options={{ title: 'Detalhes' }} />
      <PessoasStack.Screen name="PessoaForm" component={PessoaFormScreen} options={{ title: 'Pessoa' }} />
    </PessoasStack.Navigator>
  )
}

function ProdutosStackScreen() {
  return (
    <ProdutosStack.Navigator>
      <ProdutosStack.Screen name="ProdutoList" component={ProdutoListScreen} options={{ title: 'Produtos' }} />
      <ProdutosStack.Screen name="ProdutoDetail" component={ProdutoDetailScreen} options={{ title: 'Detalhes' }} />
      <ProdutosStack.Screen name="ProdutoForm" component={ProdutoFormScreen} options={{ title: 'Produto' }} />
    </ProdutosStack.Navigator>
  )
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color, size }) => {
              const name = route.name === 'Pessoas' ? 'people' : 'pricetag'
              return <Ionicons name={name as any} size={size} color={color} />
            },
          })}
        >
          <Tab.Screen name="Pessoas" component={PessoasStackScreen} />
          <Tab.Screen name="Produtos" component={ProdutosStackScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}
