import { sanityClient, urlFor } from '../../sanity'
import Header from '../../components/Header'
import { Post } from './../../typings'
import { GetStaticProps, GetStaticPaths } from 'next'
import PortableText from 'react-portable-text'

interface Props {
  post: Post
}

export default function PostPage({ post }: Props) {
  console.log(post)
  return (
    <main>
      <Header />
      <img
        src={urlFor(post.mainImage).url()}
        alt={post.title}
        className="h-40 w-full object-cover md:h-80"
      />

      <article className="mx-auto max-w-3xl px-5 md:p-0 mb-12">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="mb-2 text-xl font-light text-gray-500">
          {post.description}
        </h2>

        <div className="flex items-center space-x-5">
          <img
            src={urlFor(post.author.image).url()}
            alt={`Author: ${post.author.name}`}
            className="h-12 w-12 rounded-full object-cover"
          />
          <p className="text-sm font-extralight">
            Blog post by{' '}
            <span className="text-green-600">{post.author.name}</span> -
            Published at &nbsp;
            {new Date(post._createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className='mt-10'>
          <PortableText
            content={post.body}
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
          />
        </div>
      </article>
    </main>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const query = `*[type=='post'] {
        _id,
        slug {
            current
        }
    }`

  const posts = await sanityClient.fetch(query)

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `
    *[_type=='post' && slug.current == $slug][0] {
        _id,
        _createdAt,
        title,
        author->{
            name,
            image
        },
        'comments': *[
            _type == 'comment' &&
            post._ref == ^._id &&
            approved == true
        ],
        description,
        mainImage,
        slug,
        body
    }
  `
  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  }
}
