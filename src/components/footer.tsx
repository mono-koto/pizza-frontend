import React from "react";
import { AboutDialogLink } from "./info-dialogs/about-dialog-link";
import { PayPalDialogLink } from "./info-dialogs/paypal-dialog-link";
import { SecurityDialogLink } from "./info-dialogs/security-dialog-link";

function Footer() {
  return (
    <footer className='grow-0 text-center text-xs leading-5'>
      <PayPalDialogLink content='PayPal user?' /> |{" "}
      <AboutDialogLink content='FAQ' /> |{" "}
      <SecurityDialogLink content='Security + Safety' /> |{" "}
      <a
        target='_blank'
        href='https://github.com/mono-koto/pizza-frontend/blob/main/LICENSE'
      >
        MIT License
      </a>{" "}
      |{" "}
      <a target='_blank' href='https://github.com/mono-koto/pizza-frontend'>
        Source
      </a>{" "}
      <br />
      Made with 🤟 by{" "}
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
