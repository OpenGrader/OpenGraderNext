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

  // only redirect of not on target page
  if (ctx.resolvedUrl.match(/.*profile\?new=true.*/) == null) {
    // check for user in the profile table
    const { data: profile } = await supabase
      .from("user")
      .select("euid")
      .eq("auth_id", session.user.id)
      .limit(1)
      .single();
    if (profile && !profile.euid) {
      return {
        redirect: {
          destination: "/profile?new=true",
          permanent: false,
        },
      };
    }
  }

  return ssp(ctx);
};

export default redirectToLogin;
