import { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import { Notification, Customer, Room } from "../types";

const AdminSupport = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connectedRooms, setConnectedRooms] = useState<Room[]>([]);
  const socket = useContext(SocketContext);

  // Function to grant access
  const showChatRequest = () => {
    socket?.on("to-admin", notification => {
      if (
        notifications.some(
          (notif: Notification) => notif.id === notification.id
        )
      ) {
        console.log("already exists");
        socket?.emit("request-alert", {
          id: socket.id,
          msg: "Request already recieved dont need to send again get lost",
        });
      } else {
        setNotifications([...notifications, notification]);
      }
    });
  };

  // Function to render the connected chat rooms for the user
  const displayChatRooms = () => {
    socket?.on("on-join-chat", (user, room) => {
      const chatRoom: Room = { ...user, room };
      const roomid = room;
      console.log(user, room);
      if (connectedRooms?.some((room: Room) => room.room === roomid)) {
        console.log("already exists");
      } else {
        setConnectedRooms([...connectedRooms, chatRoom]);
      }
    });
    // Listening wether user has joined the room or not if yes then render this user on our screen
    // socket?.on("on-join-chat", (user, room) => {
    //   const chatRoom: Room = { ...user, room };
    //   console.log(chatRoom);
    //   setConnectedRooms(prevMsg => [...prevMsg, chatRoom]);
    // });
  };

  // Function to remove a notification
  const removeNotification = (id: string) => {
    const updatedNotifs = notifications.filter(notif => notif.id !== id);
    setNotifications(updatedNotifs);
  };

  // Function to trigger when admin accepts the request
  const onRequestAccept = (id: string) => {
    // Emit the request accept event to the server
    socket?.emit("request-accept", id);
    // Remove notification also when accepting
    removeNotification(id);
  };

  useEffect(() => {
    // Connect to socket instance
    socket?.connect();
    socket?.on("connect", () => console.log("admin connected"));
    displayChatRooms();

    return () => {
      socket?.disconnect();
    };
  }, []);

  useEffect(() => {
    showChatRequest();
    displayChatRooms();
  }, [notifications, connectedRooms]);

  return (
    <div style={{ padding: "0 1rem" }}>
      <h1>Welcome Admin</h1>
      <p>Whats your plan for today ?</p>

      {/* User to be pop up when chat request arrive */}
      {notifications?.length !== 0 && (
        <div
          style={{
            position: "absolute",
            top: 10,
            transform: "translateX(-50%)",
            left: "50%",
            zIndex: 2,
          }}
        >
          {notifications.map((notif, i) => (
            <div
              key={notif.id}
              style={{
                backgroundColor: "#fff",
                boxShadow: "0 0 5px 2px rgba(0,0,0,0.2)",
                padding: "0.6rem 1rem",
              }}
            >
              <h2>Chat Request !!</h2>
              <p>{notif.msg}</p>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button onClick={() => onRequestAccept(notif.id)}>
                  Accept
                </button>
                <button>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {connectedRooms.length && (
        <aside
          style={{
            boxShadow: "0 0 5px 2px rgba(0,0,0,0.2)",
            position: "fixed",
            right: 10,
            top: 10,
            paddingRight: "1rem",
            backgroundColor: "#fff",
          }}
        >
          <ul>
            {connectedRooms?.map(room => (
              <Link to={`/chat/brad/${room.room}`} key={room.room}>
                <li
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: "1.6rem",
                    cursor: "pointer",
                    borderBottom: "1px solid #bbb",
                    paddingBottom: "1rem",
                  }}
                >
                  <div>
                    <strong>Name: </strong>
                    {room.name}
                  </div>
                  <div>
                    <strong>Email: </strong>
                    {room.email}
                  </div>
                  {/* <div style={{ marginTop: "0.6rem" }}>
                      <button>Accept</button>
                      <button>Reject</button>
                    </div> */}
                </li>
              </Link>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
};

export default AdminSupport;
