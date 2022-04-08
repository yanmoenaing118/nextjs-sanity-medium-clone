import { sanityClient, urlFor } from '../../sanity'
import Header from '../../components/Header'
import { Post } from './../../typings'
import { GetStaticProps, GetStaticPaths } from 'next'
import PortableText from 'react-portable-text'
import Head from 'next/head'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useState } from 'react'

interface FormInput {
  _id: string
  name: string
  email: string
  comment: string
}

interface Props {
  post: Post
}

export default function PostPage({ post }: Props) {
  console.log(post.comments)
  const [submitted, setSubmitted] = useState<Boolean>(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>()

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => setSubmitted(true))
      .catch(() => setSubmitted(false))
  }

  return (
    <main className="mb-12">
      <Head>
        <title>{post.title}</title>
      </Head>
      <Header />
      <img
        src={urlFor(post.mainImage).url()}
        alt={post.title}
        className="h-40 w-full object-cover md:h-80"
      />
      <article className="mx-auto max-w-3xl px-5 md:p-0 ">
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

        <div className="mt-10">
          <PortableText
            content={post.body}
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
          />
        </div>
      </article>
      <hr className="mx-auto mt-10 max-w-xl border border-yellow-400" />
      {submitted ? (
        <div className="mx-auto mt-5 max-w-2xl bg-yellow-500 py-10 px-5 text-center font-bold text-white">
          <h3 className="text-3xl font-bold">
            Thanks for submitting your comment!
          </h3>
          <p className="text-sm font-bold">
            It will appear once it's submitted.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto mt-12 flex max-w-3xl flex-col p-5"
        >
          <h3 className="font-bold text-yellow-500">Enjoyed the article?</h3>
          <h2 className="text-2xl font-bold">Leave a comment below!</h2>
          <hr className="my-4" />

          <input type="hidden" {...register('_id')} value={post._id} />
          <label className="my-2">
            <span className="font-bold text-gray-600">Name</span>
            <input
              {...register('name', { required: true })}
              type="text"
              className="block w-full rounded border py-2 px-3 font-bold shadow outline-none ring-yellow-500 focus:ring"
            />
          </label>

          <label className="my-2">
            <span className="font-bold text-gray-600">Email</span>
            <input
              {...register('email', { required: true })}
              type="email"
              className="block w-full rounded border py-2 px-3 font-bold shadow outline-none ring-yellow-500 focus:ring"
            />
          </label>

          <label className="my-2">
            <span className="font-bold text-gray-600">Comment</span>
            <textarea
              {...register('comment', { required: true })}
              rows={8}
              className="block w-full resize-none rounded border py-2 px-3 font-bold shadow outline-none ring-yellow-500 focus:ring"
            />
          </label>

          <button
            type="submit"
            className="mt-4 w-full bg-yellow-500 py-2 text-white hover:bg-yellow-400"
          >
            submit
          </button>

          <div className="mt-5">
            {errors.name && (
              <p className="font-bold text-red-500">Name is required *</p>
            )}
            {errors.email && (
              <p className="font-bold text-red-500">
                A valid email is required *
              </p>
            )}
            {errors.comment && (
              <p className="font-bold text-red-500">
                Comment cannot be empty *
              </p>
            )}
          </div>
        </form>
      )}

      <div className='max-w-3xl mx-auto py-10 px-5 shadow'>
        <h3 className='text-4xl'>Comments</h3>
        <hr className='mb-5' />
        {post.comments.map((item) => (
          <div key={item._id} className='my-2'>
            <p>
              <span className='text-yellow-500'>{item.name}</span>: {item.comment}
            </p>
          </div>
        ))}
      </div>
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
