import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import { sanityClient, urlFor } from '../sanity'
import { Post } from '../typings'

interface Props {
  posts: [Post]
}

export default ({ posts }: Props) => {
  console.log(posts)
  return (
    <div className="">
      <Head>
        <title>Medium 2.0</title>
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
      </div>

      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6'>
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <a>
              <div className='group border rounded-lg overflow-hidden'>
                <img src={urlFor(post.mainImage).url()} alt={post.title} className="h-60 w-full object-cover group-hover:scale-105 transition-transform ease-in-out" />
                <div className="flex justify-between bg-white p-5">
                  <div>
                    <p className='text-lg font-bold'>{post.title}</p>
                    <p className='text-xs'>
                      {post.description} by {post.author.name}
                    </p>
                  </div>
                  <div className="h-12 w-12">
                    <img
                      src={urlFor(post.author.image).url()}
                      alt={post.author.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </a>
          </Link>
        ))}
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
