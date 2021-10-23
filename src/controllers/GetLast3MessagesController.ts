import { Request, Response } from "express";
import { Get3LastMessagesService } from "../services/Get3LastMessagesServices"
class Get3LastMessagesController {
    async handle(request: Request, response: Response) {
        const service = new Get3LastMessagesService();
        const result = await service.execute();
        return response.json(result);
    }
};

export { Get3LastMessagesController }