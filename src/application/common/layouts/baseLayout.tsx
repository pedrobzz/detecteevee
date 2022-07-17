import React from "react";
import Navbar from "../components/Navbar";

export const BaseLayout: React.FC = ({ children }): JSX.Element => {
  return (
    <div className="bg-zinc-900 w-screen h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="w-full h-full p-12">{children}</div>
    </div>
  );
};
