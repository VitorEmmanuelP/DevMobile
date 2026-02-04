import { useQuery } from "@tanstack/react-query";
import { Text, View } from "react-native";

export function HomeScreen() {
    const {} = useQuery({
        queryKey: ['homeData'],
        queryFn: async () => {

  return (
    <View>
      <Text>Welcome to the Home Screen!</Text>
    </View>
  );
}