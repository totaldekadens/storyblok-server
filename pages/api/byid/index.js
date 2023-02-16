import { storyblokInit, apiPlugin } from "@storyblok/react";
import axios from "axios";
import StoryblokClient from "storyblok-js-client";
import randomstring from "randomstring";

// Updates one story
export default async function handler(req, res) {
  const { method } = req;

  // Connection Storyblok Content API
  storyblokInit({
    accessToken: process.env.storyblokApiToken,
    use: [apiPlugin],
  });
  // Connection Storyblok Management API
  const Storyblok = new StoryblokClient({
    oauthToken: process.env.storyblockOathToken,
  });

  switch (method) {
    case "GET":
      try {
        res.json({ success: true, data: "Du kom in i GET!" });
      } catch (error) {
        res.json({ success: false, data: "Couldnt get anything" });
      }
      break;
    case "POST":
      try {
        if (!req.body) {
          return res.status(400).json({ success: false, data: "Check body" });
        }

        const defaultLang = "en"; // Default language
        // Data to tobbe translate by storyId
        let { data } = await Storyblok.get(
          //`spaces/${req.body.space_id}/stories/${req.body.story_id}/export.json?lang_code=${defaultLang}&export_lang=true`
          `spaces/196581/stories/258991850/export.json?lang_code=en&export_lang=true`
        );

        /////////////////////////////////////////////////////
        // #3
        // POST object to Tobbe translate/Laravel
        //console.log({ data, id: req.body.story_id, spaceId:req.body.space_id , toLang: filteredLang });

        // #4
        // Receive Translated objects and POST to Storyblok for each country. Testing on one story.
        //console.log({ data, id, spaceId, toLang: filteredLang });

        // #5
        //console.log({ data, id, spaceId, toLang: filteredLang });

        // generates random string to show the trigger works
        const random = randomstring.generate(7);

        // Mockup data. Represents "data" we get back from laravel
        const json = {
          "83266319-7946-4ecd-b2ed-a51b8c17c08b:all-articles:title":
            "En story uppdaterad " + random, // Test data
          language: "es",
          page: "258991850",
          text_nodes: 0,
          url: "blog/",
        };

        // What we need from laravel to be able to POST back translated objects to Storyblock
        //console.log({ json, id, spaceId });

        // Updates story with specific language
        axios({
          url: `https://mapi.storyblok.com/v1/spaces/196581/stories/258991850/import.json?lang_code=es`,
          // url: `https://mapi.storyblok.com/v1/spaces/${req.body.space_id}/stories/${req.body.story_id}/import.json?lang_code=${json.language}`,
          method: "put",
          headers: {
            Authorization: process.env.storyblockOathToken,
          },
          data: { data: JSON.stringify(json) },
        });

        res.status(200).json({ success: true, data: req.body });
      } catch (error) {
        res.status(400).json({ success: false, message: error });
      }
      break;
    default:
      res.status(400).json({ success: false, data: "Break error" });
      break;
  }
}
