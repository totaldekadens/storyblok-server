import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  // Updates locales on all stories.
  const handleClick = async () => {
    try {
      // Will get spaceId and storyId from webhook later. Will not use storyId at the moment.
      const body = {
        space_id: 196581,
      };
      const request = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      };
      let response = await fetch("/api", request);
      let result = await response.json();
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  };

  // Updates locales on one story. Will later be triggered with webhook when content is updated
  const handleClick2 = async () => {
    try {
      // Will get spaceId and storyId from webhook later. Only mockup data
      const body = {
        text: "The user angelica.moberg@hotmail.com published the Story Home (home)\nhttps://app.storyblok.com/#/me/spaces/196581/stories/0/0/258991850",
        action: "published",
        space_id: 196581,
        story_id: 258991850,
      };
      const request = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      };
      let response = await fetch("/api/byid", request);
      let result = await response.json();
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>SERVER</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <button onClick={handleClick}>Update all stories</button>
        <button onClick={handleClick2}>
          Update one story (triggered by Storyblock later)
        </button>
      </main>
    </div>
  );
}
