import Image from "next/image";
import Link from "next/link";
import React from "react";

// import { useTRCP } from "../application/common/hooks/useTRCP";

const Home = (): JSX.Element => {
  // const [name, setName] = useState("");
  // const ctx = useContext(AppContext);
  // const trpc = useTRCP();
  // const hello = trpc.useQuery(["user.hello", name]);
  return (
    <div className="flex items-center flex-col gap-8">
      <h1 className="text-5xl text-slate-200">Select Your Game</h1>
      <div>
        <Link href="/nameGuesser">
          <div className="flex flex-col items-center border-purple-900 border-2 rounded-xl p-4 cursor-pointer">
            <div className="m-[-50px]">
              <Image
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png"
                height={256}
                width={256}
                className=""
              />
            </div>
            <h2 className="text-3xl text-slate-200">Name Guesser</h2>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
