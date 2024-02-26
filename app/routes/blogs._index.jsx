import {json} from '@shopify/remix-oxygen';
import {Link, useLoaderData} from '@remix-run/react';
import {Pagination, getPaginationVariables} from '@shopify/hydrogen';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: `Hydrogen | Blogs`}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export const loader = async ({request, context: {storefront}}) => {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 10,
  });

  const {blogs} = await storefront.query(BLOGS_QUERY, {
    variables: {
      ...paginationVariables,
    },
  });

  return json({blogs});
};

export default function Blogs() {
  /** @type {LoaderReturnData} */
  const {blogs} = useLoaderData();

  return (
    <div className="flex justify-center blogs">
      <h1 className={'collection-description'}>
        <span className="w-10/12 text-[27vw] md:text-[22vw] lg:w-[22vw]  text-white leading-[20vw] md:leading-[20vw] lg:leading-[20vw] font-normal uppercase">
          Stories We Love
        </span>
      </h1>
      <div className="w-full blogs-grid md:w-10/12">
        <Pagination connection={blogs}>
          {({nodes, isLoading, PreviousLink, NextLink}) => {
            return (
              <>
                <PreviousLink>
                  {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
                </PreviousLink>
                {nodes.map((blog) => {
                  return (
                    <div
                      className="w-full h-12 text-xl font-bold "
                      key={blog.handle}
                    >
                      <Link
                        className="blog"
                        prefetch="intent"
                        to={`/blogs/${blog.handle}`}
                      >
                        <h2>{blog.title}</h2>
                      </Link>
                    </div>
                  );
                })}
                <div className="flex items-center justify-center w-full h-12 rounded-full bg-slate ">
                  <NextLink>
                    {isLoading ? 'Loading...' : <span>Load more</span>}
                  </NextLink>
                </div>
              </>
            );
          }}
        </Pagination>
      </div>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
  query Blogs(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    blogs(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        title
        handle
        seo {
          title
          description
        }
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
