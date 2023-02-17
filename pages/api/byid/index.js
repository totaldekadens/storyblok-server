import { storyblokInit, apiPlugin } from "@storyblok/react";
import axios from "axios";
import StoryblokClient from "storyblok-js-client";
import randomstring from "randomstring";
/* 

Updates one story (Triggered by Storyblok when story gets published)

*/

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
    case "POST":
      try {
        if (!req.body) {
          return res.status(400).json({ success: false, data: "Check body" });
        }

        const defaultLang = "en"; // Default language

        // Todo: Filter language. Get spaceinfo (not working?) whyy??
        console.log(req.body.space_id);
        let { data2 } = await Storyblok.get("spaces/", {});
        console.log(data2);

        // GETs translateable object from Storyblok,
        let { data } = await Storyblok.get(
          `spaces/${req.body.space_id}/stories/${req.body.story_id}/export.json?lang_code=${defaultLang}&export_lang=true`
        );
        // Example output from "data":
        /* 
          {
            "8a6e38d3-e1b8-4f2b-ad93-a7e4a7f0fcab:teaser:headline": "Services",
            "90a1c1c7-3fe5-4179-bb78-d07b972ddf43:feature:name": "Number 1",
            "040bf7d1-cc19-46bc-8f58-7840eab49f7d:feature:name": "Number 2",
            "e118d0e2-ea24-4b9e-a428-42edda5a0e83:feature:name": "Number 3",
            "bbc9d6b1-951c-4844-aa39-f0a4b7c1c01c:feature:name": "Number 544",
            page: "258991852",
            language: "en",
            url: "services",
            text_nodes: 0,
          };
          */

        // Todo:  POST object to Tobbe translate/Laravel
        /*  
         const body = {
            id, // 258991850
            space_id: req.body.space_id, // 196581
            data, // se eaxample above
            toLang: filteredLang, // [ { "code": "de", "name": "German" } ]
          };
          
          const request = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          };
          let response = await fetch("/urltotobbetranslateapi", request);
          let result = await response.json();
          console.log(result); 
           */

        // Todo:  Receive Translated objects and POST to Storyblok for each country.
        // generates random string to show the trigger works. Will be removed later
        const random = randomstring.generate(7);

        // Mockup data. Represents "data" we get back from laravel.
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
        await axios({
          url: `https://mapi.storyblok.com/v1/spaces/${req.body.space_id}/stories/${req.body.story_id}/import.json?lang_code=${json.language}`,
          method: "put",
          headers: {
            Authorization: process.env.storyblockOathToken,
          },
          data: { data: JSON.stringify(json) },
        })
          .then(function (response) {
            if (response.status == 200) {
              return res
                .status(200)
                .json({ success: true, data: "Story updated" });
            }
            return res
              .status(response.status)
              .json({ success: false, message: response.statusText });
          })
          .catch(function (error) {
            throw error;
          });
      } catch (error) {
        res.status(400).json({ success: false, message: error });
      }

      break;
    default:
      res.status(400).json({ success: false, data: "Break error" });
      break;
  }
}
