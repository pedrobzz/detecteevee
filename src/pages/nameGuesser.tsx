/* eslint-disable @typescript-eslint/no-unused-vars */

import Image from "next/image";
import React, { useState } from "react";

/* import { Container } from "./styles"; */
import { useTRCP } from "../application/common/hooks/useTRCP";
import NameGuesser from "../application/modules/NameGuesser";

const NameGuesserPage: React.FC = (): JSX.Element => {
  // const [name, setName] = useState("");
  // const ctx = useContext(AppContext);

  return (
    <div className="flex items-center flex-col gap-8">
      <h1 className="text-5xl text-slate-200">Guess the Pokemon</h1>
      <div>
        <NameGuesser />
      </div>
    </div>
  );
};

export default NameGuesserPage;
