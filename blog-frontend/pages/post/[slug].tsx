import client from "../../client";

const Post = (props: any) => {
  const { title = 'Missing title', name = 'Missing name' } = props.post
  return (
    <article>
      <h1>{title}</h1>
      <span>By {name}</span>
    </article>
  );
};

// When you use getStaticPaths in Next.js, all possible pages are pre-built at the time of the build process and stored in the /out folder. This means that when a user navigates to a dynamic page, the page is already pre-built and ready to be served, resulting in faster page loads and better user experience.

export async function getStaticPaths() {
  const paths = await client.fetch(
    `*[_type == "post" && defined(slug.current)][].slug.current`
  )
 console.log(`Paths:`, paths.map((slug: any) => ({params: {slug}})))
  return {
    paths: paths.map((slug: any) => ({params: {slug: slug}})),
    fallback: true,
  }
}


// getStaticProps fetches the data for each individual path (via props) and renders the data
export async function getStaticProps(context: any) {
  const { slug = "" } = context.params;
  const { id = "" } = context.params;

  console.log("ID --------- ", {id})
  console.log('Query:', `*[_type = "post" && slug.current == ${slug}][0]`);
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{title, "name": author->name}`,
    {slug}
  );
    console.log(`*********************************** Slug:`, post)
  return {
    props: {
      post,
    },
  };
}

export default Post;
