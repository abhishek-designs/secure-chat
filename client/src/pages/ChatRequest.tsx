import { FC, useEffect, useState, useContext } from "react";
import { RouteProps, useHistory } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import { Customer } from "../types";

interface Props {
  location: {
    state: Customer;
  };
}

const ChatRequest: FC<RouteProps & Props> = props => {
  const history = useHistory();
  const [loader, setLoader] = useState(false);

  const [user] = useState<Customer>(props.location?.state);
  const [givenRoom, setRoom] = useState("");
  // Using socket instance for realtime communication
  const socket = useContext(SocketContext);
  // props.location && props.location?.state
  // Function to send a request for chat with admin
  const onChatRequest = () => {
    console.log(user);
    socket?.emit("chat-request", user);
  };

  useEffect(() => {
    //? Connect to the socket instance first
    // socket?.connect();
    socket?.on("connect", () => console.log("we are connected"));
    // Fetch the alert if any
    socket?.on("on-alert", alert => console.log(alert));

    // SERVER Get the roomid and redirect to chat room if request has been accepted by admin
    socket?.on("on-request-accept", response => {
      // socket?.emit("join-chat", user, response.room);
      // setRoom(response.room);
      history.push(`/chat/${user.name}/${response.roomid}`, user);
    });
    // Disconnect from socket before unmounting
    // return () => {
    //   socket?.disconnect();
    // };
  }, []);

  useEffect(() => {
    socket?.on("on-waiting", load => {
      setLoader(load);
    });
    console.log(loader);
  }, [loader]);

  return (
    <div>
      <h1>Chat with our admin</h1>
      <p>Have a nice day</p>
      <div>{loader ? "Loading....." : "no loading"}</div>
      <br />
      <br />
      <br />
      <button onClick={onChatRequest}>Request for a chat</button>
    </div>
  );
};

export default ChatRequest;
