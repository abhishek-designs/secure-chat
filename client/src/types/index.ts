export interface Customer {
  id: string;
  name: string;
  email: string;
}

export interface Message {
  id: string;
  userid: string;
  msg: string;
}

export interface ChatParams {
  user: string;
  room: string;
}
