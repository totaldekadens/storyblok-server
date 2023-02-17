import { storyblokInit, apiPlugin, getStoryblokApi } from "@storyblok/react";
import axios from "axios";
import StoryblokClient from "storyblok-js-client";
import randomstring from "randomstring";
/* 

Updates ALL stories (Triggered by button)

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

        const storyblokApi = getStoryblokApi();
        const defaultLang = "en"; // Default language

        // Get translatable languages from space
        let response = await Storyblok.get(`spaces/${req.body.space_id}/`);
        let languages = response.data.space.languages;

        // Get all stories
        let { data } = await storyblokApi.get(`cdn/stories/`, {
          version: "draft",
          language: defaultLang,
          resolve_links: "url",
        });

        if (!data) {
          return res
            .status(404)
            .json({ success: false, data: "Stories not found" });
        }

        // Gets list of all story ids
        const storyIds = data.stories.map((story) => story.id);

        /* 
        #1 Loops through all Ids, 
        #2 GETs translateable object from Storyblok, 
        #3 POSTs object to laravel/TobbeTranslate, 
        #4 Receives a response from Laravel (Translated object), 
        #5 POSTs translated object to Storyblok 
        */

        // #1
        for (let i = 0; i < storyIds.length; i++) {
          let id = storyIds[i];

          // #2
          let { data } = await Storyblok.get(
            `spaces/${req.body.space_id}/stories/${id}/export.json?lang_code=${defaultLang}&export_lang=true`
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

          // #3 Todo:  POST object to Tobbe translate/Laravel

          const body = {
            story_id: id, // 258991850
            space_id: req.body.space_id, // 196581
            data, // se eaxample above
            toLang: languages, // [ { "code": "de", "name": "German" },{ "code": "es", "name": "Spanish" } ]
          };
          //console.log(body);

          const request = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          };
          /*  
          let response = await fetch("/urltotobbetranslateapi", request);
          let result = await response.json();
          console.log(result); 
           */

          // #4
          // Todo:  Receive Translated objects and POST to Storyblok for each country.
          // What we need from laravel to be able to POST back translated objects to Storyblock
          /*  const responseFromTobbe = [
          {
            story_id: 258991850,
            space_id: 196581,
            data: {
              "83266319-7946-4ecd-b2ed-a51b8c17c08b:all-articles:title":
                "En story med en text uppdaterad till spanska",
              language: "es", // language this object shall import to
              page: "258991850",
              text_nodes: 0,
              url: "blog/",
            },
          },
          {
            story_id: 258991850,
            space_id: 196581,
            data: {
              "83266319-7946-4ecd-b2ed-a51b8c17c08b:all-articles:title":
                "En story med en text uppdaterad till tyska",
              language: "de", // language this object shall import to
              page: "258991850",
              text_nodes: 0,
              url: "blog/",
            },
          },
        ]; */

          //Testing on one story.
          if (id == 258991850) {
            // Generates random string to show the trigger works
            const random = randomstring.generate(7);

            // Mockup data. Represents "data" we get back from laravel
            const json = {
              "83266319-7946-4ecd-b2ed-a51b8c17c08b:all-articles:title":
                "Du har uppdaterat alla stories-" + random, // Test data
              language: "es",
              page: "258991850",
              text_nodes: 0,
              url: "blog/",
            };

            // Updates story with specific language (with mockup data atm). Not adjusted to a response with array.
            axios({
              url: `https://mapi.storyblok.com/v1/spaces/${req.body.space_id}/stories/${id}/import.json?lang_code=${json.language}`,
              method: "put",
              headers: {
                Authorization: process.env.storyblockOathToken,
              },
              data: { data: JSON.stringify(json) },
            });
          }
        }
        res
          .status(200)
          .json({ success: true, data: "All stories are updated" });
      } catch (error) {
        res.status(400).json({ success: false, message: error });
      }
      break;
    default:
      res.status(400).json({ success: false, data: "Break error" });
      break;
  }
}
