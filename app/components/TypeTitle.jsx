import React, { useState, useEffect } from 'react';

export function TypeTitle({ text, typingSpeed = 100, align, subtitle }) {
  const [visibleCharacters, setVisibleCharacters] = useState(0);

  useEffect(() => {
    const delayTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleCharacters(prevCount =>
          prevCount < text.length ? prevCount + 1 : prevCount
        );
      }, typingSpeed); // Adjust the interval to control the speed of transition

      return () => clearInterval(interval);
    }, 3000); // 3-second delay before starting the character display

    return () => clearTimeout(delayTimeout); // Clear the delay timeout if component unmounts
  }, [text, typingSpeed]);

  return (
    <div className={'flex relative h-screen flex-col w-full items-start justify-end'}>
      <div className="text-animation-container">
        <span className="text ">
          {text.split('').map((char, index) => (
            <span
              key={index}
              className={`char ${index < visibleCharacters ? 'show' : ''}`}
            >
              <h1 className='md:-mb-12'>
                <span className="w-full text-[27cqw] md:text-[28cqw] leading-none text-white font-normal uppercase">
                  {char}
                </span>
              </h1>
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
