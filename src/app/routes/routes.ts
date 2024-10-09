import { Router } from "express";
import roomApi from "../routes/room/room.controller";
import roomServiceApi from "../routes/room-service/room-service.controller";
import roomFeedbackApi from "../routes/room-feedback/room-feedback.controller";
import imagesApi from "../routes/images/images.controller";
import webhookApi from "../routes/webhook/webhook.controller";

const api = Router()
  .use(roomApi)
  .use(roomServiceApi)
  .use(roomFeedbackApi)
  .use(imagesApi)
  .use(webhookApi);

export default Router().use("/api", api);
