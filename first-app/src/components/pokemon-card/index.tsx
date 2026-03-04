import { Image, View, Text } from "react-native";

export type PokemonCardProps = {
    name: string;
    imageUrl: string;
};

export function PokemonCard({ name, imageUrl }: PokemonCardProps) {
    return (
        <View style={{ width: 200, height: 250, alignSelf: "center", backgroundColor: "#F3F3F3", marginVertical: 4 }}>
            <Image source={{ uri: imageUrl }} style={{ width: 200, height: 200 }} />
            <Text style={{fontSize: 18, color: "gray", fontWeight: "bold", alignSelf: "center"}}>{name}</Text>
        </View>
    )
}