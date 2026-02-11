import { pokemonApi } from "./pokemon-api";
import { PokemonListRequest, PokemonListResponse } from "./pokemon-types";

async function fetchListPokemons(request: PokemonListRequest): Promise<PokemonListResponse> {

    const requests: Promise<PokemonListResponse>[] = [];

    for (let i = request.offset; i < request.offset + request.limit; i++) {
        requests.push(pokemonApi.fetchPokemons({ id: i }));
    }
    
    const responses = await Promise.all(requests);
    const pokemons = responses.flat();

    return pokemons;

}

export const pokemonService = {
    fetchListPokemons,
}