import { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";

const Test = () => {
  // const socket = useContext(SocketContext)

  useEffect(() => {
    // socket
  }, []);
  return (
    <div>
      <h1>Hello</h1>
    </div>
  );
};

export default Test;
