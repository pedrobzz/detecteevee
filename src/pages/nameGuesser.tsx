/* eslint-disable @typescript-eslint/no-unused-vars */

import React from "react";

/* import { Container } from "./styles"; */
import { useTRCP } from "../application/common/hooks/useTRCP";

const NameGuesser: React.FC = (): JSX.Element => {
  // const [name, setName] = useState("");
  // const ctx = useContext(AppContext);
  const trpc = useTRCP();
  const pokemons = trpc.useQuery([
    "pokemon.getRandomPokemon",
    { MAX_INDEX: 10, totalPokemons: 5 },
  ]);
  return (
    <div>
      <h1> Hello, NameGuesser!</h1>
      <button
        onClick={() => {
          console.log(pokemons.data);
        }}
      >
        Log Pokemons
      </button>
    </div>
  );
};

export default NameGuesser;
