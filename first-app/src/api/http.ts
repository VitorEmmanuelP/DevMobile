import { api } from "./api";

export async function fetchPokemons() {
    const response = await api.get('/pokemons');
    return response.data;
}