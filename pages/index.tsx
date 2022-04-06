import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import { sanityClient, urlFor } from '../sanity'
import { Post } from "../typings";
interface Props {
  posts: [Post]
}

export default ({posts}) => {
  console.log(posts);
  return (
    <div className="">
      <Head>
        <title>Medium 2.0</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className="mx-auto max-w-7xl bg-yellow-400">
        <div className="space-y-5 border-y border-black px-10 py-10">
          <h1 className="max-w-xl font-serif text-6xl">
            <span className="underline decoration-black decoration-4">
              Medium
            </span>{' '}
            is a place to write, read and connect
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

export const getServerSideProps = async () => {
  const query = `*[_type=="post"] {
    _id,
    title,
    slug,
    author -> {
    name,
    image
  },
  description,
  mainImage
  }`

  const posts = await sanityClient.fetch(query)

  return {
    props: {
      posts,
    },
  }
}
