const chats = [
  {
    id: 1,
    msg: "hey there",
  },
  {
    id: 2,
    msg: "hey there",
  },
  {
    id: 3,
    msg: "hey there",
  },
];

localStorage.setItem("chats", JSON.stringify(chats));

console.log(JSON.parse(localStorage.getItem("chats")));

// if (
//   notifications.some(
//     (notif: Notification) => notif.id === notification.id
//   )
// ) {
//   console.log("already exists");
//   socket?.emit("request-alert", {
//     id: socket.id,
//     msg: "Request already recieved dont need to send again get lost",
//   });
// } else {
// // }
