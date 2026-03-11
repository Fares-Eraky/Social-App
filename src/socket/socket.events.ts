export enum SocketEvents {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  
  FRIEND_REQUEST_SENT = 'friend:request:sent',
  FRIEND_REQUEST_RECEIVED = 'friend:request:received',
  FRIEND_REQUEST_ACCEPTED = 'friend:request:accepted',
  
  MESSAGE_SENT = 'chat:message:sent',
  MESSAGE_RECEIVED = 'chat:message:received',
  TYPING_START = 'chat:typing:start',
  TYPING_STOP = 'chat:typing:stop',
  
  GROUP_CREATED = 'group:created',
  GROUP_MESSAGE = 'group:message',
  USER_JOINED_GROUP = 'group:user:joined',
  
  NOTIFICATION = 'notification',
  ERROR = 'error',
}
