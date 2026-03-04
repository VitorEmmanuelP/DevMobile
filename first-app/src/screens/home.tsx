import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { usePokemonList } from "../domain/pokemon/use-cases/use-pokemon-list";
import { PokemonCard } from "../components/pokemon-card";

export function HomeScreen() {

  const { data, hasNextPage, fetchNextPage,  } = usePokemonList({ limit: 10, offset: 0 });
  const pokemons = data?.pages.flatMap((page) => page) ?? [];


  function renderItem({ item }:  { item: any }) {
    return (  
      <PokemonCard name={item.name} imageUrl={item.sprites.front_default?.toString() || ''} />
    )
  }
  function footerComponent() {
    if (!hasNextPage) {
      return null;
    }
    return (
      <ActivityIndicator  />
    );
  }

  return (
  <View style={{ flex: 1 }}>
      <FlatList
        data={pokemons}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        style={{ gap: 10 }}
        ListFooterComponent={footerComponent}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}
