import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AdminSupport from "./pages/AdminSupport";
import AdminChat from "./pages/AdminChat";
import { SocketContext, socket } from "./context/SocketContext";
import Test from "./pages/Test";

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <Router>
        <Switch>
          <Route exact path="/" component={AdminSupport} />
          <Route exact path="/chat/:user/:room" component={AdminChat} />
        </Switch>
      </Router>
    </SocketContext.Provider>
  );
}

export default App;
