import { pokemonApi } from "./pokemon-api";
import { PokemonListRequest, PokemonListResponse } from "./pokemon-types";

async function fetchListPokemons(request: PokemonListRequest): Promise<PokemonListResponse> {

    const requests: Promise<PokemonListResponse>[] = [];
    const startId = request.offset + 1;

    for (let i = startId; i < startId + request.limit; i++) {
        requests.push(pokemonApi.fetchPokemons({ id: i }));
    }
    try {
        const responses = await Promise.all(requests);
        console.log("responses", responses);

        const pokemons = responses.flat();
        
        return pokemons;
    } catch (error) {
        console.error("Erro ao buscar pokémons", error);
        throw error;
    }

}

export const pokemonService = {
    fetchListPokemons,
}