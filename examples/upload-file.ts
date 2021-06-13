import { multipart, NHttp } from "../mod.ts";

const app = new NHttp();

app.post(
  "/upload-image",
  multipart.upload({ name: "image", required: true }),
  ({ response, body, file }) => {
    console.log(file.image);
    console.log(body);
    response.send("Success upload file");
  },
);

app.listen(3000, () => {
  console.log("> Running on port 3000");
});
