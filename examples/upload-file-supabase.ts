import nhttp, { multipart, NFile } from "../mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const url = "https://yoururl.supabase.co";
const api_key = "supabase_api_key";
const supabase = createClient(url, api_key);

const upload = multipart.upload({
  name: "image",
  dest: "upload/to/myfolder",
  writeFile: async (pathfile, buff) => {
    await supabase.storage.from("bucket_name").upload(pathfile, buff);
  },
});

const app = nhttp();

app.post<{ file: { image: NFile } }>("/upload", upload, (rev) => {
  console.log("my pathfile =>", rev.file.image.pathfile);
  return "success upload";
});

app.listen(8000);
