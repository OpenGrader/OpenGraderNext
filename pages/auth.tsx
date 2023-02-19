import { NextPage } from "next";
import { HiOutlineBookOpen } from "react-icons/hi";
import { useEffect, useState } from "react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

const AuthPage: NextPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const supabase = useSupabaseClient();
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      router.push("/course");
    }
  }, [session?.user]);

  return (
    <div className="h-screen flex justify-center items-center container mx-auto text-slate-100">
      <div className="w-full h-screen md:h-auto flex content-center flex-wrap md:w-auto md:min-w-[300px] md:border border-gray-500 text-gray-300 shadow-md py-2 px-8 rounded-md bg-gray-900">
        <h1 className="text-2xl mt-4 flex items-center gap-2 font-light w-full">
          <div className="rounded-full bg-teal-900 w-8 h-8 flex items-center justify-center">
            <HiOutlineBookOpen className="h-5 w-5 text-teal-300" />
          </div>
          OpenGrader
        </h1>
        <div className="w-full">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              className: {
                input: "!text-slate-100 focus:ring-teal-500 focus:ring-2 bg-slate-950 rounded",
                label: "!text-slate-100",
                message: "bg-cyan-800 p-2 w-full rounded-md text-cyan-100",
              },
              variables: {
                default: {
                  colors: {
                    brand: "#06b6d4",
                    brandAccent: "#0891b2",
                    messageTextDanger: "#fecaca",
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="h-screen flex justify-center items-center">
  //     <div className="flex flex-col container mx-auto items-center gap-3 text-slate-50">
  //       <HiOutlineBookOpen className="w-36 h-36 aspect-square stroke-slate-50" />
  //       <h1 className="text-4xl font-bold">Register for OpenGrader</h1>
  //       <form action="/register" className="flex flex-col gap-3 mx-auto">
  //         <input
  //           type="text"
  //           className="rounded-lg bg-gray-800 text-center h-10 w-80"
  //           placeholder="Username"
  //           required
  //           minLength={3}
  //           maxLength={32}
  //           onChange={(e) => setUsername(e.target.value)}
  //         />

  //         <input
  //           type="password"
  //           className="rounded-lg bg-gray-800 text-center h-10 w-80"
  //           placeholder="Password"
  //           required
  //           min-minLength={12}
  //           onChange={(e) => setPassword(e.target.value)}
  //         />
  //         <button className="w-full h-10 bg-green-800 text-center rounded-lg">Register</button>
  //       </form>
  //     </div>
  //   </div>
  // );
};

export default AuthPage;
