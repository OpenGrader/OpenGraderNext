import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const Upload = () => {
  const [file, setFile] = useState<File>();
  const supabase = useSupabaseClient();

  async function fileUpload(file?: File) {
    if(file){
      console.log("HAS FILE")
    }

    const { data, error } = await supabase.storage.from("assignments").upload("Sample/testfile.zip", file || "");

    console.log(data);
    console.log(error);
  }

  return (
    <>
      <form>
        <label htmlFor="file-upload"> File Upload: </label>
        <input type="file" accept=".zip, .rar, .7zip" onChange={(e) => setFile(e.target.files?.[0])} />
        <div>
          <button type="button" onClick={(e) => fileUpload(file)}>
            submit
          </button>
        </div>
      </form>
    </>
  );
};

export default Upload;
