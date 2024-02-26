import {defer} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
// import {Suspense} from 'react';
import React, { useState } from 'react';
// import {Image, Money} from '@shopify/hydrogen';
import {HomeHero} from '~/components/HomeHero';
import {KeyFrameText} from '../components/KeyFrameText';
import {HomeProducts} from '../components/HomeProducts';
import {WhyUs} from '../components/WhyUs';
import {Belief} from '../components/Belief';
import {TestComponent} from '../components/TestComponent';
/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
};
/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  const {storefront} = context;
  const home_hero = await storefront.query(HOME_HERO);
  const home_intro = await storefront.query(HOME_INTRO);
  const home_belief = await storefront.query(HOME_BELIEVE); 
  const home_products = await storefront.query(PRODUCTS);
  const why_us = await storefront.query(WHY_US);

  return defer({home_hero, home_intro, home_products, why_us, home_belief});
}
export default function Homepage() {


  /** @type {LoaderReturnData} */
  const {home_hero, home_intro, home_products, why_us, home_belief} = useLoaderData();  
 
  return (
    <div className={"-mt-20 transition-all duration-500 "}>
      <HomeHero content={home_hero.metaobject.fields} />
      <KeyFrameText content={home_intro.metaobject.fields} />
      <HomeProducts products={home_products.products} />
      <TestComponent content={why_us.metaobjects.nodes}/>
      <Belief content={home_belief.metaobject.fields} />
    </div>
    

  );
}

export const HOME_HERO = `#graphql
query content ( $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: "home-hero", type: "hero"}) {
    fields {
      key
      type
      value
      reference {
        ... on MediaImage {
          id
          image {
            url
          }
        }
      }
    }
  }
}
`;
export const HOME_INTRO = `#graphql
query intro ( $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: "home-intro", type: "intro"}) {
    fields {
      key
      type
      value
    }
  }
}
`;
export const HOME_BELIEVE = `#graphql
query believe ( $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: "belief", type: "belief"}) {
    fields {
      key
      type
      value
      reference {
        ... on MediaImage {
          id
          image {
            url
          }
        }
      }
    }
  }
}
`;
export const WHY_US = `#graphql
query whyus ( $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobjects(type: "why", first: 3) {
    nodes {
      fields {
        type
        value
        key
      }
    }
  }
}
`;
export const PRODUCTS = `#graphql
query products ( $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 2) {
    edges {
      node {
        handle
        title
        images(first: 1) {
          nodes {
            url
          }
        }
        metafield(namespace: "custom", key: "subtitle") {
          value
          type
        }
        priceRange {
          maxVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
}
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
