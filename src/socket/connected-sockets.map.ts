export class ConnectedSocketsMap {
  private sockets: Map<string, Set<string>>;

  constructor() {
    this.sockets = new Map();
  }

  addSocket(userId: string, socketId: string): void {
    if (!this.sockets.has(userId)) {
      this.sockets.set(userId, new Set());
    }
    this.sockets.get(userId)!.add(socketId);
    console.log(`Socket ${socketId} added for user ${userId}`);
  }

  removeSocket(userId: string, socketId: string): void {
    const userSockets = this.sockets.get(userId);
    if (userSockets) {
      userSockets.delete(socketId);
      if (userSockets.size === 0) {
        this.sockets.delete(userId);
        console.log(`User ${userId} is now offline`);
      }
      console.log(`Socket ${socketId} removed for user ${userId}`);
    }
  }

  getUserSockets(userId: string): string[] {
    const userSockets = this.sockets.get(userId);
    return userSockets ? Array.from(userSockets) : [];
  }

  isUserOnline(userId: string): boolean {
    return this.sockets.has(userId) && this.sockets.get(userId)!.size > 0;
  }

  getAllConnectedUsers(): string[] {
    return Array.from(this.sockets.keys());
  }

  getSocketCount(userId: string): number {
    return this.sockets.get(userId)?.size || 0;
  }
}

export const connectedSockets = new ConnectedSocketsMap();
