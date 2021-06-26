import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import Orderbook from "@/components/orderbook";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Crypto Orderbook</title>
        <meta
          name="description"
          content="See latest orders of cryptos by trade volumes"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Crypto Orderbook</h1>
        <Orderbook />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://www.youtube.com/watch?v=0LyVXopt5o4"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image
              src="/youtube.svg"
              alt="Youtube Logo"
              width={18}
              height={18}
            />
          </span>{" "}
          Kangzeroo
        </a>
      </footer>
    </div>
  );
}
