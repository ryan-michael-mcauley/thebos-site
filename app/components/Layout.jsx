import { Await, useRouteData } from '@remix-run/react';
import { Suspense, useEffect, useState, useRef } from 'react';
import { Aside } from '~/components/Aside';
import { Footer } from '~/components/Footer';
import { Header, HeaderMenu } from '~/components/Header';
import { SoundToggle } from '~/components/SoundToggle';
import { CartMain } from '~/components/Cart';
import { PredictiveSearchForm, PredictiveSearchResults } from '~/components/Search';
import { useLocation } from 'react-router-dom'; // Import the useLocation hook

export function Layout({ cart, children = null, footer, header, isLoggedIn }) {
  const scrollref = useRef(null);
  const location = useLocation(); // Use the useLocation hook from react-router-dom
  const [isTransitioning, setIsTransitioning] = useState(true); // Initially transitioning

  useEffect(() => {
    setIsTransitioning(true); // Set transitioning to true on route change
    const timeout = setTimeout(() => {
      setIsTransitioning(false); // After 2.5 seconds, set transitioning to false
    }, 2500); // 2.5 seconds

    return () => clearTimeout(timeout);
  }, [location.key]); // Listen for changes in the location key (route changes)

  const [headerBg, setHeaderBg] = useState('bg-transparent');

  useEffect(() => {
    const handleScroll = () => {
      if (scrollref) {
        const scrolled = scrollref.current.getBoundingClientRect();
        if ((scrolled.top * -1) >= window.innerHeight) {
          setHeaderBg('bg-black/20 backdrop-blur-sm');
        } else {
          setHeaderBg('bg-transparent');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className='relative' ref={scrollref}>
      <div className={"fixed top-0 left-0 z-50 w-full h-screen bg-[#84824D] transition-transform duration-150 ease-out " + (isTransitioning ? 'translate-y-[0vh]' : 'translate-y-[100vh]')}></div>
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside menu={header.menu} shop={header.shop} />
      <Header header={header} cart={cart} isLoggedIn={isLoggedIn} headerBg={headerBg} />

      <main>{children}</main>
      <Suspense>
        <Await resolve={footer}>
          {(footer) => (
            <Footer menu={footer.menu1} menus={footer.menu2} shop={header.shop} />
          )}
        </Await>
      </Suspense>
    </div>
  );
}

// Other components remain the same


/**
 * @param {{cart: LayoutProps['cart']}}
 */
function CartAside({cart}) {
  return (
    <Aside id="cart-aside" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchAside() {
  return (
    <Aside id="search-aside" heading="SEARCH">
      <div className="flex flex-col w-full gap-4 predictive-search">
        <PredictiveSearchForm>
          {({fetchResults, inputRef}) => (
            <div className="flex flex-col w-full gap-4">
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
                className="ring-1 border border-slate-300 ring-[#79773a] focus:ring-1 focus:ring-slate-300 focus:border focus:border-[#79773a]  "
              />

              {/* <button
                type="submit"
                className="w-full h-12 bg-[#79773a] rounded-full flex justify-center items-center text-[#79773a] "
              >
                Search
              </button> */}
            </div>
          )}
        </PredictiveSearchForm>
        <PredictiveSearchResults />
      </div>
    </Aside>
  );
}

/**
 * @param {{
 *   menu: HeaderQuery['menu'];
 *   shop: HeaderQuery['shop'];
 * }}
 */
function MobileMenuAside({menu, shop}) {
  return (
    <Aside id="mobile-menu-aside" heading="MENU">
      <HeaderMenu
        menu={menu}
        viewport="mobile"
        primaryDomainUrl={shop.primaryDomain.url}
      />
    </Aside>
  );
}

/**
 * @typedef {{
 *   cart: Promise<CartApiQueryFragment | null>;
 *   children?: React.ReactNode;
 *   footer: Promise<FooterQuery>;
 *   header: HeaderQuery;
 *   isLoggedIn: boolean;
 * }} LayoutProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
