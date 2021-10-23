import {Router} from "express";
import {AuthenticateUserController} from "./controllers/AuthenticateUserController";
import { CreateMessageController } from "./controllers/CreateMessageController";
import { Get3LastMessagesController } from "./controllers/GetLast3MessagesController";
import { GetUserProfileController } from "./controllers/GetUserProfileController";
import { ensureAuthenticated } from "./controllers/middleware/ensureAuthenticated";
import { GetProfileUserService } from "./services/GetProfileUserService";
const router = Router();
router.post("/authenticate", new AuthenticateUserController().handle);
router.post("/messages", ensureAuthenticated, new CreateMessageController().handle);
router.get("/messages/last3", new Get3LastMessagesController().handle);
router.get("/profile", ensureAuthenticated,  new GetUserProfileController().handle);
 export {router}