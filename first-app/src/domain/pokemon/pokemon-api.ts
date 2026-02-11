import { api } from "../../api/api";
import {PokemonListResponse, PokemonRequest } from "./pokemon-types";

 async function fetchPokemons(request: PokemonRequest): Promise<PokemonListResponse> {
    const response = await api.get('/' + request.id);
    return response.data;
}


export const pokemonApi = {
    fetchPokemons,
}