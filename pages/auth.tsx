import { NextPage } from "next";
import { useEffect } from "react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import OpenGraderLogo from "Components/OpenGraderLogo";

const AuthPage: NextPage = () => {
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
        <OpenGraderLogo />
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
};

export default AuthPage;
