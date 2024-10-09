import { Request, Response } from "express";
import prisma from "../../../prisma/prisma-client";

const express = require("express");
const { Webhook } = require("svix");
const bodyParser = require("body-parser");

const router = express.Router();

// You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
  throw new Error("Please add WEBHOOK_SECRET from Clerk Dashboard to .env");
}

// Body parser middleware to handle JSON payloads
router.use(bodyParser.json());

router.post("/webhook", async (req: Request, res: Response) => {
  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).send("Error occurred -- no svix headers");
  }

  const body = JSON.stringify(req.body);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return res.status(400).send("Error occurred");
  }

  // Do something with the payload
  const { id } = evt.data;
  const eventType = evt.type;
  
  if (eventType === "user.created") {
    const { id, username, first_name, last_name, email_addresses, image_url } =
      evt.data;
    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      firstName: first_name,
      lastName: last_name,
      photo: image_url,
      role: "user",
      isRejected: false,
    };
    const newUser = await prisma.user.create({
      data: user,
    });
    // if (newUser) {
    //   await clerkClient.users.updateUserMetadata(id, {
    //     publicMetadata: {
    //       userId: newUser._id,
    //       role: "user",
    //     },
    //   });
    // }

    res.json({ message: "New user created", user: newUser });
  }

  res.status(200).send();
});

export default router;
