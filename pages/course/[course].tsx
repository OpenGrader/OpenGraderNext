import Sidebar from "Components/Sidebar";
import { pageData } from "types";
import withProtected from "util/withProtected";
import { GetServerSidePropsContext } from "next";

export const getServerSideProps = async (context: GetServerSidePropsContext) =>
  withProtected(context, async () => {
    const data = context.query.course;
    return { props: { data } };
  });

const Page = ({ data }: { data: Array<string> }) => {
  return (
    <div className="flex">
      <Sidebar />
      <h1 className="font-bold text-3xl text-slate-50 w-10/12 ml-auto">Homepage</h1>
    </div>
  );
};

export default Page;
