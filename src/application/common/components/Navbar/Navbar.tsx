/* eslint-disable @typescript-eslint/no-unused-vars */

import Link from "next/link";
import React from "react";

/* import { Container } from "./styles"; */

const Navbar = (): JSX.Element => {
  return (
    <div className="flex p-5 justify-between text-slate-200">
      <h1 className="text-3xl">
        <Link href="/">DetectEevee</Link>
      </h1>
      <div className="flex gap-2 text-xl">
        {/* <Link href="/nameGuesser">Name Guesser</Link> */}
        <Link href="#">Leaderboards</Link>
      </div>
    </div>
  );
};

export default Navbar;
