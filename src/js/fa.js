import { library, dom } from "@fortawesome/fontawesome-svg-core";
// import { faUserAstronaut } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faGithub, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";

// We are only using the user-astronaut icon
library.add(faEnvelope, faGithub, faLinkedinIn);

// Replace any existing <i> tags with <svg> and set up a MutationObserver to
// continue doing this as the DOM changes.
dom.watch();

// faHammer;
