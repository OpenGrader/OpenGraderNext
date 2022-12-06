import { GetServerSidePropsContext, NextPage } from "next";
import withProtected from "util/withProtected";

// Redirect to login if not signed in, course page if signed in.

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withProtected(ctx, async () => {
    return {
      redirect: {
        destination: "/course",
        permanent: false,
      },
    };
  });

const Index: NextPage = () => {
  return <></>;
};

export default Index;
