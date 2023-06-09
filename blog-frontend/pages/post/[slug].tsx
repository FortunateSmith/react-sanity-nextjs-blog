import client from "../../client";
import groq from "groq";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";

function urlFor(source: any) {
  return imageUrlBuilder(client).image(source);
}

const ptComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <img
          alt={value.alt || ""}
          loading="lazy"
          src={urlFor(value)
            .width(320)
            .height(240)
            .fit("max")
            .auto("format")
            .url()}
        />
      );
    },
  },
};

const Post = (props: any) => {
  const {
    title = "Missing title",
    name = "Missing name",
    categories,
    authorImage,
    body= []
  } = props.post;
  console.log("PROPS", props);
  return (
    <article>
      <h1>{title}</h1>
      <span>By {name}</span>
      {categories && (
        <ul>
          Posted in:
          {categories.map((category: any) => (
            <li key={category}>{category}</li>
          ))}
        </ul>
      )}
      {authorImage && (
        <div>
          <img src={urlFor(authorImage).width(125).url()}
          alt={`${name}'s picture`}></img>
        </div>
      )}
      <PortableText
      value={body}
      components={ptComponents}
      />
    </article>
  );
};

// categories[]->title, means loop through array of categories and extract titles from associated categories
const query = groq`*[_type == "post" && slug.current == $slug][0]{
  "title": title,
  "name" : author->name,
  "categories" : categories[]->title,
  "authorImage" : author->image,
  body
}`;

console.log("Qweery", query);
// When you use getStaticPaths in Next.js, all possible pages are pre-built at the time of the build process and stored in the /out folder. This means that when a user navigates to a dynamic page, the page is already pre-built and ready to be served, resulting in faster page loads and better user experience.

export async function getStaticPaths() {
  const paths = await client.fetch(
    groq`*[_type == "post" && defined(slug.current)][].slug.current`
  );
  //  console.log(`Paths:`, paths.map((slug: any) => ({params: {slug}})))
  return {
    paths: paths.map((slug: any) => ({ params: { slug: slug } })),
    fallback: true,
  };
}

// getStaticProps fetches the data for each individual path (via props) and renders the data
export async function getStaticProps(context: any) {
  const { slug = "" } = context.params;
  const { id = "" } = context.params;

  // console.log("ID --------- ", {id})
  // console.log('Query:', `*[_type = "post" && slug.current == ${slug}][0]`);
  const post = await client.fetch(query, { slug });
  console.log(`*********************************** Slug:`, post);
  return {
    props: {
      post,
    },
  };
}

export default Post;
