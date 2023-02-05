import { multipart, nhttp } from "../mod.ts";

const app = nhttp();

const upload = multipart.upload({ name: "image", required: true });

app.post("/upload", upload, (rev) => {
  console.log(rev.file.image);
  console.log(rev.body);
  return "Success upload file";
});

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
