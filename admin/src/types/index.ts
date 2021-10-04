export interface Notification {
  id: string;
  msg: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
}

export interface Room extends Customer {
  room: string;
}

export interface ChatParams {
  user: string;
  room: string;
}

export interface Message {
  id: string;
  userid: string;
  msg: string;
}
