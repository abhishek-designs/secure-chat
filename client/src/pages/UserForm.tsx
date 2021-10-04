import { FC, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Customer } from "../types";
import { v4 as uuidV4 } from "uuid";

const UserForm: FC = () => {
  const [user, setUser] = useState<Customer>({ id: "", name: "", email: "" });
  const [isRegistered, setRegistered] = useState(false);
  const history = useHistory();
  // Function to set details
  const setUserDetails = (e: any) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  // Function to submit the user
  const onSubmission = () => {
    if (user.email && user.name) {
      // Generate the id
      setUser({
        ...user,
        id: uuidV4(),
      });
      setRegistered(true);
    } else {
      // Fill out the fields
      alert("fill the fields");
    }
  };

  useEffect(() => {
    // Navigate to the support page with the user data
    isRegistered &&
      history.push({
        pathname: "/chat_support",
        state: user,
      });
  }, [isRegistered]);

  return (
    <div>
      <div>
        <label htmlFor="name">Enter Name</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={e => setUserDetails(e)}
          autoComplete="off"
        />
      </div>
      <div>
        <label htmlFor="email">Enter Email</label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={e => setUserDetails(e)}
          autoComplete="off"
        />
      </div>
      <button type="submit" onClick={onSubmission}>
        Register
      </button>
    </div>
  );
};

export default UserForm;
