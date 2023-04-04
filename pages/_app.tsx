import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { useState } from "react";
import Head from "next/head";
import { Provider } from "react-redux";
import { store } from "store";
import SidebarLayout from "Components/Sidebar";

function MyApp({ Component, pageProps }: AppProps<{ initialSession: Session }>) {
  const [supabase] = useState(() => createBrowserSupabaseClient());

  return (
    <>
      <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
        <Head>
          <title>OpenGrader</title>
        </Head>
        <Provider store={store}>
          <SidebarLayout>
            <Component {...pageProps} />
          </SidebarLayout>
        </Provider>
      </SessionContextProvider>
    </>
  );
}

export default MyApp;
