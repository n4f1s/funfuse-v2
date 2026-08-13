import {
  INTRO_CLAIM_ATTRIBUTE,
  INTRO_FAILSAFE_MS,
  INTRO_LOCK_CSS,
  INTRO_LOCK_ID,
  INTRO_SESSION_KEY,
} from "./intro-config";

/**
 * The session gate. One inline script, first thing in the body.
 *
 * It has to run *before* the overlay markup is parsed, because the overlay is
 * server rendered on every route and hidden by default. This script is what
 * turns it on, and the browser executes it while the parser is still upstream
 * of the overlay element, so the very first paint is either the intro or the
 * page. Never one and then the other.
 *
 * That ordering is the whole reason this is a raw script rather than an effect
 * in the island. A `useEffect` runs after hydration, which is hundreds of
 * milliseconds after first paint on a mid-range Android: the visitor would see
 * the page, then have an intro dropped on top of it.
 *
 * It writes nothing the server needs to know, so the root layout stays static.
 *
 * On a slow connection the HTML and CSS land well before the JavaScript, so
 * what this script turns on is a *resting* composition — a squared deck, the
 * lockup, a readout at zero. That is the intended state for as long as the
 * bundle takes. The animation begins when the island initialises, and runs its
 * full fixed length from there.
 *
 * Three reasons it stands down:
 *
 *   - **A hash.** `/careers/#roles` is a request for a specific place on the
 *     page. The intro locks scrolling, and a fragment that cannot be scrolled
 *     to is a broken link. Getting them there beats showing off.
 *   - **Already seen this session.** The point of the whole thing.
 *   - **`sessionStorage` throws.** Some privacy modes make it unavailable. We
 *     cannot honour "once per tab" without it, and an intro that replays on
 *     every reload is worse than no intro, so it does not run at all.
 */
export function IntroGate() {
  const gate = [
    "(function(){",
    "try{",
    "if(location.hash)return;",
    `if(sessionStorage.getItem(${q(INTRO_SESSION_KEY)}))return;`,
    `sessionStorage.setItem(${q(INTRO_SESSION_KEY)},"1")`,
    "}catch(e){return}",
    "var s=document.createElement('style');",
    `s.id=${q(INTRO_LOCK_ID)};`,
    `s.textContent=${q(INTRO_LOCK_CSS)};`,
    "document.head.appendChild(s);",
    // The last resort, and only that. It asks one question: has anything
    // claimed this? An unclaimed lock after twenty seconds means the bundle is
    // never going to run, so the page goes back to the visitor. A claimed one
    // is left entirely alone — the island owns its own lifecycle from that
    // moment, including its own much shorter watchdog.
    "setTimeout(function(){",
    `if(!s.hasAttribute(${q(INTRO_CLAIM_ATTRIBUTE)}))s.remove()`,
    `},${INTRO_FAILSAFE_MS})`,
    "})();",
  ].join("");

  return <script dangerouslySetInnerHTML={{ __html: gate }} />;
}

/** Constants go into the script as literals rather than by interpolation. */
function q(value: string) {
  return JSON.stringify(value);
}
