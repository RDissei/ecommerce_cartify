import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Configure Sanity Client
export const client = createClient({
  projectId:process.env.REACT_PUBLIC_SANITY_ID,
  dataset: 'production',
  apiVersion: '2022-03-07',
  useCdn: true,
  token:process.env.REACT_PUBLIC_SANITY_TOKEN,


});

const builder = imageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);