import "@/api/why-did-you-render/wdyr";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Orderbook from "@/components/orderbook";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <meta
          name="description"
          content="See latest orders of cryptos by trade volumes"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Orderbook />
      </main>
    </div>
  );
}
