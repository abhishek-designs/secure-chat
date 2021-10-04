import "./App.css";
import Chat from "./Chat";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { SocketContext, socket } from "./context/SocketContext";
import UserForm from "./pages/UserForm";
import ChatRequest from "./pages/ChatRequest";

function App() {
  // const [socket, setSocket] = useState();

  return (
    <SocketContext.Provider value={socket}>
      <Router>
        <Switch>
          <Route exact path="/" component={UserForm} />
          <Route exact path="/chat/:user/:room" component={Chat} />
          <Route exact path="/chat_support" component={ChatRequest} />
        </Switch>
      </Router>
    </SocketContext.Provider>
  );
}

export default App;
