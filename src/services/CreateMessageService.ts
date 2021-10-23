import prismaClient from "../prisma";

// Import socket
import { io } from "../app";

class CreateMessageService {
  // Types
  async execute(text: string, user_id: string) {
    // Create table  in prisma db
    const message = await prismaClient.message.create({
      data: {
        text,
        user_id,
      },

      // Inner join
      include: { user: true },
    });

    // Message Model 
    const infoWS = {
      text: message.text,
      id: message.id,
      created_at: message.created_at,
      user: {
        name: message.user.name,
        avatar_url: message.user.avatar_url,
      },
    };

    // Makes  the WebSocket start the listener
    io.emit("new_message", infoWS);

    return message;
  }
}

export { CreateMessageService };