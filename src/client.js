import sanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const Sanityclient = sanityClient({
  projectId: process.env.REACT_APP_SANITY_PORJECT_ID,
  dataset: "production",
  apiVersion: "2022-02-02",
  useCdn: true,
  token: process.env.REACT_APP_SANITY_TOKEN,
});

const builder = imageUrlBuilder(Sanityclient);

export const urlFor = (source) => builder.image(source);
