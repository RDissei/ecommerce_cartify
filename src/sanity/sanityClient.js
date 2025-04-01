import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Configure Sanity Client
export const client = createClient({
  projectId: 'jru6499t', // Replace with your actual Sanity Project ID
  dataset: 'production',
  useCdn: true,
  apiVersion: '2022-03-07',
  token:process.env.REACT_PUBLIC_SANITY_TOKEN,


});

const builder = imageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);