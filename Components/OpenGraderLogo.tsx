import { HiOutlineBookOpen } from "react-icons/hi";

export const OpenGraderLogo = () => {
  return (
    <h1 className="text-2xl mt-4 flex items-center gap-2 font-light w-full">
      <div className="rounded-full bg-teal-900 w-8 h-8 flex items-center justify-center">
        <HiOutlineBookOpen className="h-5 w-5 text-teal-300" />
      </div>
      OpenGrader
    </h1>
  );
};

export default OpenGraderLogo;
