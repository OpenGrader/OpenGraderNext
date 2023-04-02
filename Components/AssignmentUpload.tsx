import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const Upload = () => {
  const [file, setFile] = useState<File>();
  const [fileName, setFileName] = useState<string | undefined>("");
  const supabase = useSupabaseClient();

  async function fileUpload(file?: File) {
    if (file) {
      console.log("HAS FILE");
    }
    const path = `Sample/${file?.name}`;

    const { data, error } = await supabase.storage.from("assignments").upload(path, file || "");
  }

  useEffect(() => {
    setFileName(file?.name);
  }, [file]);

  return (
    <>
      <form className="w-96 flex flex-col items-center gap-2 p-2">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                aria-hidden="true"
                className="w-10 h-10 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              {!fileName ? (
                <>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">ZIP, RAR, 7ZIP (MAX. 50mb)</p>
                </>
              ) : (
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  Currently selected: <span className="font-semibold">{fileName}</span>
                </p>
              )}
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              accept=".zip, .rar, .7zip"
              onChange={(e) => setFile(e.target.files?.[0])}
            />
          </label>
        </div>

        {file && (
          <div className="">
            <button
              type="button"
              className="bg-transparent hover:bg-gray-500 text-gray-300 font-semibold hover:text-white py-2 px-4 border border-gray-200 hover:border-transparent rounded"
              onClick={(e) => fileUpload(file)}>
              Submit
            </button>
          </div>
        )}
      </form>
    </>
  );
};

export default Upload;
