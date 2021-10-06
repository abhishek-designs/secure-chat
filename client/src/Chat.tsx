import { useState, useEffect, FC, useContext } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import { SocketContext } from "./context/SocketContext";
import { ChatParams, Message } from "./types";

const Chat: FC<RouteComponentProps<ChatParams>> = props => {
  const history = useHistory();
  const { user, room } = props.match.params;
  const userDetails = props.location.state;
  const socket = useContext(SocketContext);
  const [announce, setAnnounce] = useState("");
  const [message, setMessage] = useState("");
  // const [loader, setLoader] = useState(false);
  const [chats, setChats] = useState<Message[]>([]);

  // Function to send message
  const sendMessage = () => {
    if (message) {
      const newMessage: Message = {
        id: uuidV4(),
        userid: socket?.id || "NA",
        msg: message,
      };

      socket?.emit("sent-message", newMessage, room);
      setChats([...chats, newMessage]);
      setMessage("");
    }
  };

  // Function to disconnect from the room
  const onDisconnect = () => {
    const msg: Message = {
      id: uuidV4(),
      userid: socket?.id || "Na",
      msg: `${user} left the chat`,
    };
    socket?.emit("on-leave-room", room, msg);
    // Redirect the client to chat support page
    history.push("/chat_support");
  };

  useEffect(() => {
    // socket?.connect();
    socket?.on("connect", () => console.log("client connected"));
    // Emit an event to join the user to the room
    socket?.emit("join-chat", userDetails, room);

    // Get the room message
    socket?.on("room-msg", msg => setChats(prevMsg => [...prevMsg, msg]));

    socket?.on("recieved-message", (msg: Message) => {
      console.log(msg);
      setChats(prevMsg => [...prevMsg, msg]);
    });

    socket?.on("leave-room", () => console.log("Leave the room client!"));
    console.log(props.match.params.room, props.match.params.user);

    return () => {
      socket?.disconnect();
    };
  }, []);

  return (
    <main className="chat-page">
      <section className="chat-section">
        {announce && <div className="msg announce-msg">{announce}</div>}
        {chats?.map(chat => (
          <div key={chat.id} className="msg-contain our-msg">
            <div className="msg">{chat.msg}</div>
          </div>
        ))}
        {/* <div className="msg-contain other-msg">
          <div className="msg">hello world</div>
        </div> */}
      </section>
      <footer>
        <input
          type="text"
          name="msg-input"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyUp={e => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
        <button onClick={onDisconnect}>Disconnect</button>
      </footer>
    </main>
  );
};

export default Chat;
