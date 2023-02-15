import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  // Updates locales on click. Will later be triggered with webhook when content is updated
  const handleClick = async () => {
    try {
      // Will get spaceId and storyId from webhook later. Will not use storyId at the moment.
      const body = {
        text: "The user angelica.moberg@hotmail.com published the Story Home (home)\nhttps://app.storyblok.com/#/me/spaces/196581/stories/0/0/258853578",
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
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <button onClick={handleClick}>Update Storyblok</button>
      </main>
    </div>
  );
}
