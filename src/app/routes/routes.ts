import { Router } from "express";
import userApi from "../routes/user/user.controller";
import roomApi from "../routes/room/room.controller";
import roomServiceApi from "../routes/room-service/room-service.controller";
import roomFeedbackApi from "../routes/room-feedback/room-feedback.controller";
import imagesApi from "../routes/images/images.controller";
import webhookApi from "../routes/webhook/webhook.controller";
import roomBookingApi from "../routes/room-booking/room-booking.controller";

const api = Router()
  .use(userApi)
  .use(roomApi)
  .use(roomServiceApi)
  .use(roomFeedbackApi)
  .use(imagesApi)
  .use(webhookApi)
  .use(roomBookingApi);

export default Router().use("/api", api);
