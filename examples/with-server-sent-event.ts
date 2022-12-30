import { NHttp } from "../mod.ts";

// deno-fmt-ignore
const html = `
    <html>
      <head>
        <title>Hello SSE</title>
        <script>
            window.onload = () => {
                const message = document.getElementById("message");
                const evtSource = new EventSource("/sse");
                evtSource.onmessage = function (event) {
                    message.innerHTML = event.data;
                }
            }
        </script>
      </head>
      <body style="width: 80%; margin: auto">
        <h1>Simple SSE</h1>
        <hr/>
        <div id="message"></div>
      </body>
    </html>
`;
const app = new NHttp();

app.get("/sse", ({ response }) => {
  response.type("text/event-stream");
  return new ReadableStream({
    start(controller) {
      controller.enqueue(`data: hello from sse\n\n`);
    },
    cancel(err) {
      console.log(err);
    },
  }).pipeThrough(new TextEncoderStream());
});

app.get("/", ({ response }) => {
  response.type("text/html");
  return html;
});

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info?.port}`);
});
