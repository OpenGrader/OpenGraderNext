import Sidebar from "../../Components/Sidebar";
import Students from "../../Components/course-pages/Students";
import { pageData } from "../../types";

export async function getServerSideProps(context: any) {
  const data = context.query.Course;
  return { props: { data } };
}

const PageLoader = ({ page }: { page: string }) => {
  switch (page) {
    case "Students":
      return <Students />;
      break;

    default:
      return <h1 className="font-bold text-3xl text-slate-50">INVALID PAGE</h1>;
      break;
  }
};

const Page = ({ data }: { data: Array<string> }) => {
  console.log(data.length);
  let pData: pageData = { parent: "Homepage", courseID: data[0] || "" };
  
  if (data.length === 1) {
    let data: pageData;

    return (
      <div className="flex">
        <Sidebar pageData={pData} />
        <h1 className="font-bold text-3xl text-slate-50">Homepage</h1>
      </div>
    );
  }

  if (data.length == 2) {
    pData.parent = data[1]
    return (
      <div className="flex">
        <Sidebar pageData={pData} />
        <div className="w-10/12">
          <PageLoader page={data[1]} />
        </div>
      </div>
    );
  }
};

export default Page;
