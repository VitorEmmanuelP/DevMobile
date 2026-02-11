import { useQuery } from "@tanstack/react-query";
import { Image, Text, View } from "react-native";
import { usePokemonList } from "../domain/pokemon/use-cases/use-pokemon-list";

export function HomeScreen() {

  const {data} = usePokemonList({ limit: 10, offset: 0 });

''
  console.log(data);

  return (
    <View>
      <Image source={{uri: data?.[0].sprites.front_default}} style={{width: 100, height: 100}} />
    </View>
  );
}