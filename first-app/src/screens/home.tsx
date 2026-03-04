import { FlatList, Image, Text, View } from "react-native";
import { usePokemonList } from "../domain/pokemon/use-cases/use-pokemon-list";

export function HomeScreen() {

  const { data } = usePokemonList({ limit: 10, offset: 0 });
  const pokemons = data?.pages.flatMap((page) => page) ?? [];

  console.log(pokemons);

  return (
    <View>
      <FlatList
      data={pokemons}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Image source={{ uri: item.sprites.front_default?.toString() }} style={{ width: 100, height: 100 }} />
          </View>
        )}
      />
    </View>
  );
}