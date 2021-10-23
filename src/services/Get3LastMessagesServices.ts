import prismaClient from "../prisma";

class Get3LastMessagesService {
    async execute() {
        const messages = await prismaClient.message.findMany({
            take: 3, //findmany + take 3 Allows to return the last 3 messages
            orderBy: {
                created_at: "desc",

            },
            include: {
                user: true,
            },
        });
        return messages;
    }
}

export { Get3LastMessagesService };

