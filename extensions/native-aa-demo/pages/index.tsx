import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import TransactionCard from './components/TransactionCard'

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <Head>
          <title>Native Account Abstraction Demo</title>
          <meta name="description" content="quantum-safe future of Ethereum with Native AA" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <div className={styles.explainer}>
            For this demo, an embedded wallet is preloaded in the browser, allowing you to experience 
            fully quantum-resistant transactions without needing to connect an external wallet. 
            All transactions made on this site are processed through Pioneer Alpha devnet — a 
            customized OP Stack implementation featuring Native Account Abstraction (RIP-7560). 
            <span>
              To learn more about Pioneer Alpha, please visit the &nbsp;
              <a target='_blank' href='https://docs.pioneer.kroma.network/'>official documentation.</a>
            </span>
          </div>
          <TransactionCard />
        </main>

        <footer className={styles.footer}>
          <a
            href="https://kroma.network"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by &nbsp;{' '}
              <Image src="/kroma.svg" alt="Kroma Logo" width={71} height={16} />
          </a>
        </footer>
      </div>
    </div>
  )
}
