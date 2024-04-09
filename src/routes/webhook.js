import express from "express";
import axios from "axios";
import "dotenv/config";
import { getGenerativeAIResponse } from "../utils/utils.js";

const router = express.Router();

const verify_token = process.env.VERIFY_TOKEN;
const access_token = process.env.ACCESS_TOKEN;

router.get("/", (req, res) => {
  try {
    let mode = req.query["hub.mode"];
    let challenge = req.query["hub.challenge"];
    let token = req.query["hub.verify_token"];

    console.log(mode, challenge, token);

    if (mode && token) {
      if (mode === "subscribe" && token === verify_token) {
        res.status(200).send(challenge);
      } else {
        res.status(403);
      }
    }
  } catch (error) {
    console.error({ error });
    return res.sendStatus(500);
  }
});

router.post("/", async (req, res) => {
  try {
    let body_param = req.body;

    // console.log(JSON.stringify(body_param, null, 2));

    if (
      body_param.object &&
      body_param.entry &&
      body_param.entry[0].changes &&
      body_param.entry[0].changes[0].value.messages &&
      body_param.entry[0].changes[0].value.messages[0]
    ) {
      let phone_no_id =
        body_param.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body_param.entry[0].changes[0].value.messages[0].from;
      let msg = body_param.entry[0].changes[0].value.messages[0];

      if (msg.type === "text" && msg.text) {
        const airesponse = await getGenerativeAIResponse(msg.text.body);
        console.log(airesponse);

        await axios({
          method: "POST",
          url:
            "https://graph.facebook.com/v13.0/" +
            phone_no_id +
            "/messages?access_token=" +
            access_token,
          data: {
            messaging_product: "whatsapp",
            to: from,
            type: "text",
            text: {
              body: airesponse,
            },
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        });
      }
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error({ error });
    return res.sendStatus(500);
  }
});

export default router;
