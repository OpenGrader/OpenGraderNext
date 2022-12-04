import { NextPage } from "next";
import { useState } from "react";
import { HiOutlineBookOpen } from "react-icons/hi";

const Login: NextPage = () => {
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col w-80 items-center gap-3 font-bold text-slate-50">
        <HiOutlineBookOpen className="w-36 h-36 aspect-square stroke-slate-50" />
        <h1 className="text-6xl">OpenGrader</h1>
        <form className="flex flex-col w-full gap-3">
          <input
            type="text"
            className="rounded-lg bg-gray-800 text-center h-10"
            placeholder="Username"
            onChange={(e) => setUserName(e.target.value)}
          />

          <input
            type="password"
            className="rounded-lg bg-gray-800 text-center h-10"
            placeholder="Password"
            onChange={(e) => setPassWord(e.target.value)}
          />
        </form>
        <button className="w-full h-10 bg-green-800 text-center rounded-lg">Login</button>
      </div>
    </div>
  );
};

export default Login;
