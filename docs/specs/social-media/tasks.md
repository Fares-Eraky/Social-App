# Implementation Plan

- [x] 1. Initialize project and install dependencies



  - Initialize Node.js project with TypeScript configuration
  - Install core dependencies: express, mongoose, socket.io, zod, bcrypt, jsonwebtoken, @aws-sdk/client-s3, multer, nodemailer
  - Install dev dependencies: @types packages, ts-node, nodemon
  - Create tsconfig.json with appropriate compiler options
  - Set up .env.example file with required environment variables
  - Create .gitignore file


  - _Requirements: All requirements depend on proper project setup_






- [x] 2. Set up project structure and shared utilities


  - [x] 2.1 Create directory structure for all modules




    - Create src folder with config, middleware, utils, modules, socket, storage, shared subdirectories


    - Create module folders: user, post, comment, friend, chat
    - _Requirements: All requirements_


  - [ ] 2.2 Implement custom exception class
    - Create AppException class extending Error with statusCode and isOperational properties




    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_


  - [x] 2.3 Create status code constants


    - Define HTTP status code constants in shared/constants/status-codes.ts
    - _Requirements: 3.3_


  - [ ] 2.4 Create role constants
    - Define user roles and signature levels in shared/constants/roles.ts


    - _Requirements: 2.2, 2.5_




- [ ] 3. Implement database connection and base repository
  - [ ] 3.1 Create database configuration
    - Implement MongoDB connection with retry logic in config/database.config.ts
    - Export connectDB function


    - _Requirements: 4.1, 4.2, 4.3_


  - [x] 3.2 Implement abstract base repository

    - Create BaseRepository class with generic type parameter
    - Implement findOne, create, update, delete, find methods


    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_


  - [ ] 3.3 Create extended request types
    - Define IRequest interface extending Express Request with user property
    - _Requirements: 2.4_



- [x] 4. Implement utility functions


  - [x] 4.1 Create hash utility


    - Implement hashPassword and comparePassword functions using bcrypt
    - _Requirements: 1.2, 2.1_
  - [ ] 4.2 Create JWT utility
    - Implement generateToken and verifyToken functions


    - Define JWTPayload interface


    - _Requirements: 2.2, 2.3, 2.4_


  - [x] 4.3 Create OTP utility


    - Implement generateOTP function with 6-digit random number
    - Implement verifyOTP function with expiry check
    - _Requirements: 1.4, 1.6_
  - [x] 4.4 Create email utility

    - Implement sendEmail function using nodemailer
    - Create email templates for OTP verification


    - _Requirements: 1.5_





- [ ] 5. Implement global error handling middleware
  - [x] 5.1 Create error middleware


    - Implement global error handler that catches all errors
    - Format error responses with statusCode and message
    - Handle Zod validation errors specifically
    - Log errors appropriately


    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_



- [ ] 6. Implement Zod validation system
  - [x] 6.1 Create general field schemas


    - Define reusable Zod schemas for email, password, username, objectId
    - _Requirements: 17.4_


  - [x] 6.2 Create validation middleware wrapper


    - Implement validate function that accepts Zod schema and returns middleware
    - Handle validation errors and pass to error handler
    - _Requirements: 17.1, 17.2, 17.3, 17.5_



- [x] 7. Implement User module


  - [x] 7.1 Create User model with Mongoose hooks


    - Define IUser interface and User schema


    - Implement pre-save hook to hash password if modified


    - Implement pre-updateOne hook for password hashing
    - _Requirements: 1.1, 1.2, 1.3, 4.4, 9.1, 9.2_


  - [x] 7.2 Create User repository


    - Extend BaseRepository for User model
    - Implement findByEmail method
    - _Requirements: 18.1, 18.2, 18.3_


  - [x] 7.3 Create User validation schemas


    - Define Zod schemas for signup, login, confirmEmail


    - _Requirements: 1.1, 2.1, 17.1_


  - [x] 7.4 Implement User service


    - Implement signup method: validate, hash password, create user, generate OTP, send email
    - Implement confirmEmail method: verify OTP, update user


    - Implement login method: validate credentials, generate JWT


    - Implement logout method: revoke token
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2.1, 2.2, 2.3, 2.6_
  - [ ] 7.5 Create User controller
    - Implement route handlers for signup, confirmEmail, login, logout, getProfile


    - _Requirements: 1.1, 1.6, 2.1, 2.6_


  - [x] 7.6 Create User routes


    - Define routes for POST /signup, POST /confirm-email, POST /login, POST /logout, GET /profile


    - Apply validation middleware to routes
    - _Requirements: 1.1, 1.6, 2.1, 2.6_



- [ ] 8. Implement authentication and authorization middleware
  - [x] 8.1 Create authentication middleware


    - Extract JWT from Authorization header


    - Verify token and decode payload
    - Check if token is in user's active tokens list
    - Attach user data to request object
    - _Requirements: 2.4, 2.5_
  - [x] 8.2 Create authorization middleware


    - Check user role against required roles


    - Validate signature level for sensitive operations


    - _Requirements: 2.5_





- [ ] 9. Implement AWS S3 storage service
  - [x] 9.1 Create S3 configuration


    - Initialize S3Client with credentials from environment
    - _Requirements: 5.1_
  - [x] 9.2 Create multer configuration


    - Configure multer with memory storage
    - Implement file type and size validation
    - _Requirements: 5.1, 5.2_
  - [ ] 9.3 Implement storage service
    - Implement uploadFile method using PutObjectCommand


    - Implement uploadLargeFile method with multipart upload
    - Implement generatePresignedUrl method for read and write operations
    - Implement deleteFile and deleteFiles methods


    - Implement getFileStream method for streaming downloads
    - _Requirements: 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 6.4, 6.5, 16.1, 16.2, 16.3, 16.4, 16.5_



- [ ] 10. Implement Post module
  - [ ] 10.1 Create Post model with Mongoose hooks
    - Define IPost interface and Post schema
    - Implement pre-save hook to generate assetFolderId

    - Implement post-deleteOne hook to delete S3 assets and comments
    - _Requirements: 7.1, 7.2, 7.3, 9.3, 9.4_

  - [x] 10.2 Create Post repository


    - Extend BaseRepository for Post model
    - Implement getPaginatedPosts method with population
    - _Requirements: 7.4, 18.1_


  - [ ] 10.3 Create Post validation schemas
    - Define Zod schemas for createPost, updatePost
    - _Requirements: 7.1, 17.1_
  - [x] 10.4 Implement Post service


    - Implement createPost method: validate, upload files to S3, create post


    - Implement getPosts method: retrieve with pagination and availability check


    - Implement likeUnlikePost method: toggle like status, update count
    - Implement deletePost method: delete post and associated S3 assets
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.2, 8.3_
  - [ ] 10.5 Create Post controller
    - Implement route handlers for createPost, getPosts, likePost, deletePost
    - _Requirements: 7.1, 7.5, 8.1_
  - [ ] 10.6 Create Post routes
    - Define routes for POST /posts, GET /posts, POST /posts/:id/like, DELETE /posts/:id
    - Apply authentication and validation middleware
    - _Requirements: 7.1, 7.5, 8.1_

- [ ] 11. Implement Comment module
  - [ ] 11.1 Create Comment model
    - Define IComment interface and Comment schema
    - _Requirements: 8.4_
  - [ ] 11.2 Create Comment repository
    - Extend BaseRepository for Comment model
    - Implement getPaginatedComments method
    - _Requirements: 8.5, 18.1_
  - [ ] 11.3 Create Comment validation schemas
    - Define Zod schema for createComment
    - _Requirements: 8.4, 17.1_
  - [ ] 11.4 Implement Comment service
    - Implement createComment method: create comment, increment post commentsCount
    - Implement getComments method: retrieve with pagination
    - Implement deleteComment method: delete comment, decrement post commentsCount
    - _Requirements: 8.4, 8.5_
  - [ ] 11.5 Create Comment controller
    - Implement route handlers for createComment, getComments, deleteComment
    - _Requirements: 8.4, 8.5_
  - [ ] 11.6 Create Comment routes
    - Define nested routes under /posts/:postId/comments using mergeParams
    - Apply authentication and validation middleware
    - _Requirements: 8.4, 8.5_

- [ ] 12. Implement Friend module
  - [ ] 12.1 Create Friend model
    - Define IFriendRequest interface and FriendRequest schema
    - _Requirements: 11.1_
  - [ ] 12.2 Create Friend repository
    - Extend BaseRepository for FriendRequest model
    - Implement findPendingRequests and findAcceptedFriends methods
    - _Requirements: 11.5, 11.6, 18.1_
  - [ ] 12.3 Create Friend validation schemas
    - Define Zod schemas for sendRequest, acceptRequest
    - _Requirements: 11.1, 11.2, 17.1_
  - [ ] 12.4 Implement Friend service
    - Implement sendFriendRequest method: create request
    - Implement acceptFriendRequest method: update status, create connections
    - Implement rejectFriendRequest method: update status
    - Implement getFriends and getPendingRequests methods
    - _Requirements: 11.1, 11.2, 11.3, 11.5, 11.6_
  - [ ] 12.5 Create Friend controller
    - Implement route handlers for sendRequest, acceptRequest, rejectRequest, getFriends, getPendingRequests
    - _Requirements: 11.1, 11.2, 11.3, 11.5, 11.6_
  - [ ] 12.6 Create Friend routes
    - Define routes for POST /friends/request, POST /friends/accept/:id, POST /friends/reject/:id, GET /friends, GET /friends/pending
    - Apply authentication and validation middleware
    - _Requirements: 11.1, 11.2, 11.3, 11.5, 11.6_

- [ ] 13. Implement Chat module
  - [ ] 13.1 Create Chat and Message models
    - Define IChat and IMessage interfaces
    - Create Chat and Message schemas
    - _Requirements: 12.1, 12.2_
  - [ ] 13.2 Create Chat repository
    - Extend BaseRepository for Chat model
    - Implement findChatByParticipants method
    - Implement getPaginatedMessages method
    - _Requirements: 12.2, 12.5, 18.1_
  - [ ] 13.3 Create Chat validation schemas
    - Define Zod schemas for sendMessage, createGroup
    - _Requirements: 12.1, 12.4, 13.1, 13.2, 17.1_
  - [ ] 13.4 Implement Chat service
    - Implement getOrCreateChat method: find existing or create new one-on-one chat
    - Implement sendMessage method: save message to database
    - Implement getMessages method: retrieve with pagination
    - Implement createGroupChat method: create group with participants
    - Implement sendGroupMessage method: save group message
    - _Requirements: 12.1, 12.2, 12.3, 12.5, 13.1, 13.2, 13.4_
  - [ ] 13.5 Create Chat controller
    - Implement route handlers for getOrCreateChat, sendMessage, getMessages, createGroup, sendGroupMessage
    - _Requirements: 12.1, 12.5, 13.1, 13.4_
  - [ ] 13.6 Create Chat routes
    - Define routes for POST /chats, POST /chats/:id/messages, GET /chats/:id/messages, POST /chats/groups, POST /chats/groups/:id/messages
    - Apply authentication and validation middleware
    - _Requirements: 12.1, 12.5, 13.1, 13.4_

- [ ] 14. Implement Socket.IO real-time system
  - [ ] 14.1 Create socket event constants
    - Define all socket event names in socket.events.ts
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 11.1, 11.2, 11.5, 12.3, 12.4, 13.3, 13.4, 15.5_
  - [ ] 14.2 Create connected sockets map
    - Implement Map to track userId to Set of socketIds
    - Implement methods to add, remove, and get sockets for a user
    - _Requirements: 10.5, 14.1, 14.2, 14.3, 14.4, 14.5_
  - [ ] 14.3 Create socket authentication middleware
    - Extract JWT from handshake auth or query parameters
    - Verify token and attach user data to socket
    - Reject connection if authentication fails
    - _Requirements: 10.2, 10.3, 10.4_
  - [ ] 14.4 Implement Socket Gateway
    - Initialize Socket.IO server with HTTP server
    - Set up authentication middleware
    - Handle connection and disconnection events
    - Implement emitToUser method to send to all user sockets
    - Implement emitToRoom and broadcastToRoom methods
    - _Requirements: 10.1, 10.2, 10.5, 15.1, 15.2, 15.3, 15.4, 15.5_
  - [ ] 14.5 Implement friend request socket events
    - Handle FRIEND_REQUEST_SENT event
    - Emit FRIEND_REQUEST_RECEIVED to recipient
    - Emit FRIEND_REQUEST_ACCEPTED to both users
    - _Requirements: 11.1, 11.2, 11.4, 11.5_
  - [ ] 14.6 Implement chat socket events
    - Handle MESSAGE_SENT event
    - Emit MESSAGE_RECEIVED to recipient
    - Handle TYPING_START and TYPING_STOP events
    - _Requirements: 12.3, 12.4_
  - [ ] 14.7 Implement group chat socket events
    - Create rooms for group chats
    - Handle GROUP_CREATED event
    - Handle GROUP_MESSAGE event and broadcast to room
    - Implement joinGroupRooms method to auto-join user to their groups
    - _Requirements: 13.3, 13.4, 13.5, 15.2, 15.3, 15.4_
  - [ ] 14.8 Integrate socket events with services
    - Update Friend service to emit socket events on request send/accept
    - Update Chat service to emit socket events on message send
    - _Requirements: 11.1, 11.2, 11.4, 11.5, 12.3, 12.4, 13.4_

- [ ] 15. Create main application files
  - [ ] 15.1 Create Express app configuration
    - Initialize Express app in app.ts
    - Configure middleware: cors, json parser, error handler
    - Register all module routes
    - _Requirements: All requirements_
  - [ ] 15.2 Create server entry point
    - Import app and create HTTP server
    - Initialize Socket.IO with HTTP server
    - Connect to database
    - Start server on specified port
    - _Requirements: All requirements_

- [ ] 16. Create environment configuration
  - [ ] 16.1 Create .env.example file
    - List all required environment variables with example values
    - _Requirements: All requirements_
  - [ ] 16.2 Update package.json scripts
    - Add dev script with nodemon and ts-node
    - Add build script with tsc
    - Add start script for production
    - _Requirements: All requirements_
