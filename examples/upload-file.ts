import { multipart, NHttp } from "../mod.ts";

const app = new NHttp();

const myUpload = multipart.upload({ name: "image", required: true });

app.post("/upload", myUpload, ({ body, file }) => {
  console.log(file.image);
  console.log(body);
  return "Success upload file";
});

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info?.port}`);
});
