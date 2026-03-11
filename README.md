# Social Media Application

A comprehensive social media platform built with Node.js, Express, MongoDB, Socket.IO, and AWS S3.

## Features

- **User Management**: Registration with OTP email verification, JWT authentication
- **Posts**: Create posts with media uploads, like/unlike, comments
- **Friends**: Send/accept/reject friend requests
- **Chat**: One-on-one and group messaging with real-time updates
- **Real-Time**: Socket.IO for live notifications and messaging
- **File Storage**: AWS S3 integration for media uploads

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- AWS Account (for S3 storage)
- Email service (Gmail or other SMTP)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
   - MongoDB connection string
   - JWT secret key
   - AWS credentials and S3 bucket name
   - Email service credentials

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/users/signup` - Register new user
- `POST /api/users/confirm-email` - Verify email with OTP
- `POST /api/users/login` - Login user
- `POST /api/users/logout` - Logout user
- `GET /api/users/profile` - Get user profile

### Posts
- `POST /api/posts` - Create post (with file upload)
- `GET /api/posts` - Get posts (paginated)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts/:id/like` - Like/unlike post
- `DELETE /api/posts/:id` - Delete post

### Comments
- `POST /api/posts/:postId/comments` - Add comment
- `GET /api/posts/:postId/comments` - Get comments (paginated)
- `DELETE /api/posts/:postId/comments/:id` - Delete comment

### Friends
- `POST /api/friends/request` - Send friend request
- `POST /api/friends/accept/:id` - Accept friend request
- `POST /api/friends/reject/:id` - Reject friend request
- `GET /api/friends` - Get friends list
- `GET /api/friends/pending` - Get pending requests

### Chat
- `POST /api/chats` - Get or create one-on-one chat
- `GET /api/chats` - Get user's chats
- `POST /api/chats/:id/messages` - Send message
- `GET /api/chats/:id/messages` - Get messages (paginated)
- `POST /api/chats/groups` - Create group chat
- `POST /api/chats/groups/:id/messages` - Send group message

## Socket.IO Events

### Client to Server
- `chat:typing:start` - User started typing
- `chat:typing:stop` - User stopped typing

### Server to Client
- `friend:request:received` - New friend request
- `friend:request:accepted` - Friend request accepted
- `chat:message:received` - New message received
- `chat:typing:start` - User typing
- `chat:typing:stop` - User stopped typing
- `group:created` - New group created
- `group:message` - New group message

## Project Structure

```
src/
├── config/          # Configuration files
├── middleware/      # Express middleware
├── utils/           # Utility functions
├── modules/         # Feature modules
│   ├── user/
│   ├── post/
│   ├── comment/
│   ├── friend/
│   └── chat/
├── socket/          # Socket.IO setup
├── storage/         # AWS S3 service
├── shared/          # Shared types and utilities
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## Technologies

- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose
- **Real-Time**: Socket.IO
- **Storage**: AWS S3
- **Validation**: Zod
- **Authentication**: JWT, Bcrypt
- **Email**: Nodemailer

## License

ISC
