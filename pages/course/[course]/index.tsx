import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    redirect: {
      destination: `${ctx.resolvedUrl}/assignment`,
      permanent: true,
    },
  };
};

const RedirectToAssignmentPage: React.FC = () => <></>;

export default RedirectToAssignmentPage;
