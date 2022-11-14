import Sidebar from "../../Components/Sidebar";
import Students from "../../Components/course-pages/Students";

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
  const courseID = data[0] || "";
  if (data.length == 1) {
    return (
      <div className="flex">
        <Sidebar parent="Homepage" courseID={courseID} />
        <h1 className="font-bold text-3xl text-slate-50">Homepage</h1>
      </div>
    );
  }

  if (data.length == 2) {
    return (
      <div className="flex">
        <Sidebar parent={data[1]} courseID={courseID} />
        <div className="w-10/12">
          <PageLoader page={data[1]} />
        </div>
      </div>
    );
  }
};

export default Page;
