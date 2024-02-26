import { Image } from '@shopify/hydrogen';
import { Link } from '@remix-run/react';
import { useRef, useState, useEffect } from 'react';

export function HomeProducts({ products }) {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);

  const extractData = (products) => {
    return products.edges.map((item) => {
      const node = item.node || {};
      return {
        title: node.title || '',
        handle: node.handle || '',
        image: node.images?.nodes[0]?.url || '',
        subtitle: node.metafield?.value || '',
        price: node.priceRange?.maxVariantPrice?.amount || '',
        currency: node.priceRange?.maxVariantPrice?.currencyCode || '',
      };
    });
  };

  const product = extractData(products);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    setScrollY(scrollPosition);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const calculateParallax = (index) => {
    const offset = 0; // Adjust this value for desired parallax effect
    const translateY = (index + 1) * offset - scrollY / 10;
    return `translateY(${translateY}px)`;
  };

  return (
    <div className="relative flex flex-col gap-6 px-4 mt-32 md:flex-row md:justify-end">
      {product.map((product, index) => (
        <div
          key={index}
          className="flex flex-col w-full gap-4 border-b border-white md:w-1/2 "
          style={{
            transform: calculateParallax(index),
          }}
        >
          <Link
            className="product-item"
            key={product.handle}
            prefetch="intent"
            to={'products/' + product.handle}
          >
            <Image
              className="object-fit"
              src={product.image}
              sizes="(min-width: 45em) 100vw, 50vw"
            />
          </Link>
          <div className="relative flex flex-col w-full gap-3 pb-4 text-white">
            <div className="text-2xl font-light capitalize">
              <Link
                className="text-3xl product-item"
                key={product.handle}
                prefetch="intent"
                to={'products/' + product.handle}
              >
                {product.title}
              </Link>
            </div>
            <div className="text-base font-normal uppercase">
              {product.subtitle}
            </div>
            <div className="absolute top-0 right-0 text-3xl font-thin uppercase">
              {product.currency} {product.price}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
