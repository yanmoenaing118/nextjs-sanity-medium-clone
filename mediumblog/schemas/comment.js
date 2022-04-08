export default {
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'comment',
      title: 'Comment',
      type: 'string',
    },
    {
        name: 'approved',
        title: "Approved",
        type: "boolean",
        description: "Comments won't show on the site without approval"
    },
    {
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: {
        type: 'post',
      },
    },
  ],
}
