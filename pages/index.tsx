import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Medium 2.0</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className='bg-yellow-400 max-w-7xl mx-auto'>
        <div className='px-10 space-y-5 border-y border-black py-10'>
          <h1 className='text-6xl max-w-xl font-serif'>
            <span className='underline decoration-black decoration-4'>Medium</span> is a place to write, read and connect
          </h1>
          <h2>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Inventore
            accusamus reiciendis tempora eius officiis.
          </h2>
        </div>
        <div></div>
      </div>
    </div>
  )
}

export default Home
