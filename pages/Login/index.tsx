import { NextPage } from "next";
import { useState } from "react";

const Book = ({ className = "" }: { className: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
      />
    </svg>
  );
};

const Login: NextPage = () => {
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col w-80 items-center gap-3 font-bold text-gray-50">
        <Book className="w-36 aspect-square stroke-gray-50" />
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
