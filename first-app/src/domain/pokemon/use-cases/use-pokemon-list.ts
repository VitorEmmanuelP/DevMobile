import { useInfiniteQuery } from "@tanstack/react-query";
import { PokemonListRequest } from "../pokemon-types";
import { queryKeys } from "../../../constants/pokemon";
import { pokemonService } from "../pokemon-service";


export const usePokemonList = (request: PokemonListRequest) => {
     const {
         data,
         error,
         isLoading,
         isFetching,
         refetch,
         fetchNextPage,
         hasNextPage,
         isFetchingNextPage,
     } = useInfiniteQuery({
         queryKey: [queryKeys.POKEMON_LIST, request],
         queryFn: ({ pageParam }) =>
             pokemonService.fetchListPokemons({
                 limit: request.limit,
                 offset: pageParam,
             }),
         initialPageParam: request.offset,
         getNextPageParam: (_lastPage, allPages) => request.offset + allPages.length * request.limit,
     });

     return {
         data,
         error,
         isLoading,
         isFetching,
         refetch,
         fetchNextPage,
         hasNextPage,
         isFetchingNextPage,
     };
}