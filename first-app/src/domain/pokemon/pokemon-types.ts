export type PokemonListRequest = {
    limit: number;
    offset: number;
}

export type PokemonRequest = {
    id: number;
}

export type PokemonListResponse = Array<{
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  order: number;
  is_default: boolean;

  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];

  species: {
    name: string;
    url: string;
  };

  sprites: {
    front_default: string | null;
    front_shiny: string | null;
    back_default: string | null;
    back_shiny: string | null;
  };

  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];

  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
}>
