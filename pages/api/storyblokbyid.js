import { storyblokInit, apiPlugin, getStoryblokApi } from "@storyblok/react";
import axios from "axios";
import StoryblokClient from "storyblok-js-client";
import randomstring from "randomstring";

// Updates ALL stories
export default async function handler(req, res) {
  const { method } = req;

  /*   if (!req.body) {
    return res.status(400).json({ success: false, data: "Check body" });
  } */

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
    case "POST":
      try {
        const storyblokApi = getStoryblokApi();
        const defaultLang = "en"; // Default language

        /* 
      #1 Loops through all Ids, 
      #2 GETs all translateable objects from Storyblok, 
      #3 POSTs object to laravel/TobbeTranslate, 
      #4 Receives a response from Laravel (Translated object), 
      #5 POSTs translated object to Storyblok 
     */
        // #1

        // #2
        let { data } = await Storyblok.get(
          `spaces/${req.body.space_id}/stories/${req.body.story_id}/export.json?lang_code=${defaultLang}&export_lang=true`
        );
        console.log(data);
        /////////////////////////////////////////////////////
        // #3
        // POST object to Tobbe translate/Laravel
        //console.log({ data, id, spaceId, toLang: filteredLang });

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
            "Du har uppdaterat en story -" + random, // Test data
          language: "es",
          page: "258991850",
          text_nodes: 0,
          url: "blog/",
        };

        // What we need from laravel to be able to POST back translated objects to Storyblock
        //console.log({ json, id, spaceId });

        // Updates story with specific language
        axios({
          url: `https://mapi.storyblok.com/v1/spaces/${req.body.space_id}/stories/${req.body.story_id}/import.json?lang_code=${json.language}`,
          method: "put",
          headers: {
            Authorization: process.env.storyblockOathToken,
          },
          data: { data: JSON.stringify(json) },
        });

        res.status(200).json({ success: true, data: "Något blev published!" });
      } catch (error) {
        res.status(400).json({ success: false, message: error });
      }
      break;
    default:
      res.status(400).json({ success: false, data: "Break error" });
      break;
  }
}
