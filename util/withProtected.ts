import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

const redirectToLogin = async (
  ctx: GetServerSidePropsContext,
  ssp: (ctx: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<any>>,
) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };

  return ssp(ctx);
};

export default redirectToLogin;
