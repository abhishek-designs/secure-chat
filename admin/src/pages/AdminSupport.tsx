import { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import { Notification, Customer, Room } from "../types";

interface Indication {
  id: string;
  isWaiting: boolean;
}

const AdminSupport = () => {
  const [connectedRooms, setConnectedRooms] = useState<Room[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [joinedRoom, setJoinedRoom] = useState<string>();
  const [currentRoom, setCurrentRoom] = useState<Room>();
  const [isExists, setExists] = useState(false);
  const [counter, setCounter] = useState(1);
  // const [isWaiting, setWaiting] = useState<Indication>({  });

  const socket = useContext(SocketContext);
  // Function to fetch item from localstorage
  const fetchFromLocalStorage = (key: string) => {
    // Check wether if there is an existing data
    let savedRooms;
    const storedRoom: any = localStorage.getItem(key);

    savedRooms = JSON.parse(storedRoom);

    return savedRooms;
  };

  // Function check wether data exists or not
  const checkExists = (newItem: any, items: any[]) => {
    const exists = items.some(item => item.id === newItem.id);
    // setExists(exists)
    return exists;
  };

  // Function to store  item to ls
  const storeToLocalStorage = (item: any[], key: string) => {
    localStorage.setItem(key, JSON.stringify(item)); // [{}]
  };

  // Function to grant access
  const showChatRequest = () => {
    socket?.on("to-admin", notification => {
      const booleanChecker = checkExists(notification, notifications);
      !booleanChecker && setNotifications([...notifications, notification]);
      // setTimeout(() => {
      //   console.log("hello");
      //   removeNotification(notification.id);
      // }, 5000);
    });

    // Emit the loading state to all the client who sent the request
    notifications.forEach(notif => {
      // Emit the loading state
      socket?.emit("client-waiting", true, notif.id);

      setTimeout(() => {
        socket?.emit("client-waiting");
      });
    });
  };

  // Function to render the connected chat rooms for the user
  const displayChatRooms = () => {
    socket?.on("on-join-chat", (user, room) => {
      console.log({ ...user, room });
      const chatRoom: Room = { ...user, room };
      setConnectedRooms([...connectedRooms, chatRoom]);
    });
  };

  // Function to remove a notification
  const removeNotification = (id: string) => {
    const updatedNotifs = notifications.filter(notif => notif.id !== id);
    setNotifications(updatedNotifs);
  };

  // Function to trigger when admin accepts the request
  const onRequestAccept = (id: string) => {
    // setWaiting(false);
    // Emit the request accept event to the server
    socket?.emit("request-accept", id);
    // Remove notification also when accepting
    removeNotification(id);
  };

  // Function to give waiting indication to client
  const giveIndication = () => {
    // setWaiting(true);
    socket?.emit("client-waiting");
  };

  useEffect(() => {
    // Connect to socket instance
    socket?.on("connect", () => console.log("admin connected"));

    return () => {
      socket?.disconnect();
    };
  }, []);

  useEffect(() => {
    notifications.forEach(notif => {
      setTimeout(() => {
        removeNotification(notif.id);
        console.log(counter);
      }, 1000 * counter);
      setCounter(counter + 1);
    });
  }, [counter]);

  useEffect(() => {
    showChatRequest();
    giveIndication();
  }, [notifications, isExists]);

  useEffect(() => {
    displayChatRooms();
    console.log(connectedRooms);
    storeToLocalStorage(connectedRooms, "room-123");
  }, [connectedRooms]);

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
              <Link to={`/chat/brad/${room.room}`} key={room.id}>
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
