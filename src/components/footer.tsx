import React from "react";

function Footer() {
  return (
    <footer className='grow-0 text-center text-xs leading-5'>
      <a target='_blank' href='https://pyusd-garden.gitbook.io/pyusd.pizza/'>
        Docs
      </a>{" "}
      |{" "}
      <a target='_blank' href='https://github.com/mono-koto/pizza-frontend'>
        Source
      </a>{" "}
      |{" "}
      <a
        target='_blank'
        href='https://github.com/mono-koto/pizza-frontend/blob/main/LICENSE'
      >
        MIT License
      </a>{" "}
      | Made with 🤟 by{" "}
      <a target='_blank' href='https://mono-koto.com/'>
        Mono Koto
      </a>{" "}
      +{" "}
      <a target='_blank' href='https://gardenlabs.xyz/'>
        Garden Labs
      </a>
    </footer>
  );
}

export default Footer;
