import { useQuery } from "@tanstack/react-query";
import { PokemonListRequest } from "../pokemon-types";
import { queryKeys } from "../../../constants/pokemon";
import { pokemonService } from "../pokemon-service";


export const usePokemonList = (request: PokemonListRequest) => {
     const { data, error, isLoading, isFetching, refetch } = useQuery({
         queryKey: [queryKeys.POKEMON_LIST, request],
         queryFn: () => pokemonService.fetchListPokemons(request),
     });

     return {
         data,
         error,
         isLoading,
         isFetching,
         refetch,
     };
}