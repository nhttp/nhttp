import { multipartBody, NHttp } from "../mod.ts";

const app = new NHttp();

app.post(
  "/upload-image",
  multipartBody({ fileKey: "image" }),
  async (request, respondWith) => {
    if (!request.file.image) {
      throw new Error("Image is required");
    }
    let file = request.file.image as File;
    console.log(file.name);
    console.log(request.parsedBody);

    // convert to array buffer
    let arrBuf = await file.arrayBuffer();

    // save file
    await Deno.writeFile("./" + file.name, new Uint8Array(arrBuf));
    respondWith(new Response("Success upload file"));
  },
);

app.listen(3000, () => {
  console.log("> Running on port 3000");
});
