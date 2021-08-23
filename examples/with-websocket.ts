import { Handler, HttpError, NHttp } from "../mod.ts";

// deno-fmt-ignore
const html = `
    <html>
      <head>
        <title>Hello Chat</title>
        <script>
            window.onload = function(){ 
                const ws = new WebSocket("ws://localhost:3000/ws");
                const chat = document.getElementById("my_chat");
                const form = document.getElementById("my_form");
                const message = document.getElementById("my_message");
                ws.onmessage = (e) => {
                    chat.innerHTML += "<b>Friend: </b>" + e.data + "<br/>";
                }
                form.onsubmit = (e) => {
                    e.preventDefault();
                    if (!message.value || ws.readyState !== 1){
                        return;
                    }
                    ws.send(message.value);
                    chat.innerHTML += "<b>Me: </b>" + message.value + "<br/>";
                    message.value = "";
                }
            };
        </script>
      </head>
      <body style="width: 80%; margin: auto">
        <h1>Simple Chat App</h1>
        <hr/>
        <div id="my_chat"></div>
        <form id="my_form">
            <input id="my_message" placeholder="message" />
            <button type="submit">SEND</button>
        </form>
      </body>
    </html>
`;

const wsHandler: Handler = ({ request }, next) => {
  if (request.headers.get("upgrade") != "websocket") {
    return next(new HttpError(400, "Bad Websocket"));
  }
  const { socket, response } = Deno.upgradeWebSocket(request);
  const channel = new BroadcastChannel("chat");
  socket.onmessage = (e) => channel.postMessage(e.data);
  socket.onclose = () => channel.close();
  socket.onerror = () => channel.close();
  channel.onmessage = (e) => socket.send(e.data);
  return response;
};
const htmlHandler: Handler = ({ response }) => {
  response.type("text/html");
  return html;
};

const app = new NHttp();

app
  .get("/", htmlHandler)
  .get("/ws", wsHandler)
  .listen(3000);
