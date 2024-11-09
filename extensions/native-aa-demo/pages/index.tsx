import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import TransactionCard from './components/TransactionCard'
import useMedia from 'use-media';

export default function Home() {
  const isMobile = useMedia({ maxWidth: '768px' });
  const imgUrl = isMobile ? '/TitleMobile.png' : '/Title.png';

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <Head>
          <title>Native Account Abstraction Demo</title>
          <meta name="description" content="quantum-safe future of Ethereum with Native AA" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <main className={styles.main}>
          <Image
            src={imgUrl}
            alt="Title"
            layout="responsive"
            width={500}
            height={200}
            className={styles.titleImage}
          />  

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

        <div className={styles.localDemoLink}>
          <a
            href="https://www.notion.so/lightscale/Native-AA-Demo-at-Pioneer-Alpha-139426e6255680b0a93bcc7b8630bc4e#139426e6255680709ba6c603ebb5ee98"
            target="_blank"
            rel="noopener noreferrer"
          >
            Run demo on my local machine ↗
          </a>
        </div>

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
