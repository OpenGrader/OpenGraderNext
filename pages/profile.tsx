import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import withProtected from "util/withProtected";

interface ProfilePageProps {
  isNew: boolean;
  profile: {
    id: any;
    given_name: any;
    family_name: any;
    email: any;
    euid: any;
  };
}

export const getServerSideProps: GetServerSideProps = async (ctx) =>
  withProtected(ctx, async (ctx) => {
    const supabase = createServerSupabaseClient(ctx);
    const {
      data: { session: session },
    } = await supabase.auth.getSession();

    const userId = session!.user?.id;
    if (!userId) {
      return {
        redirect: {
          destination: "/auth",
          permanent: false,
        },
      };
    }

    const { data: profile } = await supabase
      .from("user")
      .select("id, given_name, family_name, email, euid")
      .eq("auth_id", userId)
      .limit(1)
      .single();

    const isNew = !!ctx.query.new?.toString() ?? false;
    return {
      props: {
        isNew,
        profile,
      },
    };
  });

export const ProfilePage: NextPage<ProfilePageProps> = ({ isNew, profile }) => {
  const [givenName, setGivenName] = useState(profile.given_name);
  const [familyName, setFamilyName] = useState(profile.family_name);
  const [euid, setEuid] = useState(profile.euid);
  const [email, setEmail] = useState(profile.email);

  return (
    <div className="flex">
      <div className="text-gray-100 px-12 pt-6 flex flex-col gap-4 h-screen ml-auto">
        <h1 className="text-3xl font-bold">{isNew ? "Welcome to OpenGrader!" : `Profile - ${profile.email}`}</h1>
        <form method="POST" action="/api/updateProfile" className="flex flex-col gap-6 overflow-auto px-2">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="given_name" className="block text-sm font-medium text-gray-200">
                First name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="given_name"
                  id="given_name"
                  autoComplete="given-name"
                  required
                  value={givenName}
                  onChange={(e) => setGivenName(e.target.value)}
                  className="block w-full rounded-md bg-gray-950 border-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="family_name" className="block text-sm font-medium text-gray-200">
                Last name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="family_name"
                  id="family_name"
                  autoComplete="family-name"
                  required
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  className="block w-full rounded-md bg-gray-950 border-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="euid" className="block text-sm font-medium text-gray-200">
                EUID
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="euid"
                  id="euid"
                  autoComplete="euid"
                  required
                  maxLength={7}
                  minLength={3}
                  value={euid}
                  onChange={(e) => setEuid(e.target.value)}
                  className="block w-full rounded-md bg-gray-950 border-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md bg-gray-950 border-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          <input type="hidden" value={profile.id} name="id" id="id" />
          <button
            type="submit"
            className="text-center items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium leading-4 ring-offset-gray-900 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Update profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
