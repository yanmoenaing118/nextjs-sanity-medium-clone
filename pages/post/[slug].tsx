import { sanityClient, urlFor } from '../../sanity'
import Header from '../../components/Header'
import { Post } from './../../typings'
import { GetStaticProps, GetStaticPaths } from 'next'

interface Props {
  post: Post
}

export default function PostPage({ post }: Props) {
  console.log(post)
  return (
    <main>
      <Header />
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
  }
}
