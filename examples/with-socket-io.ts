/* Simple realtime ChatApps */

import nhttp, { Handler } from "../mod.ts";
import { Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts";

// deno-fmt-ignore
const html = `
    <html>
      <head>
        <title>Hello Chat</title>
      </head>
      <body style="width: 80%; margin: auto">
        <h1>Simple Chat App</h1>
        <hr/>
        <div id="my_chat"></div>
        <form id="my_form">
            <input id="my_message" placeholder="message" />
            <button type="submit">SEND</button>
        </form>
        <script type="module" async>
            import io from "https://esm.sh/socket.io-client@4.6.2";
            const socket = io();
            window.onload = () => {
              const chat = document.getElementById("my_chat");
              const form = document.getElementById("my_form");
              const message = document.getElementById("my_message");
              socket.on('message', function(msg) {
                chat.innerHTML += "<b>Friend: </b>" + msg + "<br/>";
              });
              form.onsubmit = (e) => {
                e.preventDefault();
                if (!message.value){
                    return;
                }
                socket.emit('message', message.value);
                chat.innerHTML += "<b>Me: </b>" + message.value + "<br/>";
                message.value = "";
              }
            }
        </script>
      </body>
    </html>
`;
const io = new Server();

io.on("connection", (socket) => {
  socket.on("message", (data) => {
    socket.broadcast.emit("message", data);
  });
});

const app = nhttp();

const wsHandler = io.handler(app.handle);

const htmlHandler: Handler = ({ response }) => {
  response.type("html");
  return html;
};

app.get("/", htmlHandler);

app.listen({
  port: 8000,
  handler: wsHandler,
}, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
