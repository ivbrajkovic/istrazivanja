const nav = document.getElementById("nav");
console.log("TCL: nav", nav);
const links = nav.querySelectorAll(".nav__link");
console.log("TCL: links", links);
const bubble = nav.querySelector(".nav__bubble");
console.log("TCL: bubble", bubble);

/**
 * Get target elements from nav links
 * @param {*} links
 */
const getTargets = links => {
  let targets = [...links].reduce((result, link) => {
    if (link.hash) {
      const id = link.hash.replace("#", "");
      const el = document.getElementById(id);
      el && result.push(el);
    }
    return result;
  }, []);
  return targets;
};
const targets = getTargets(links);

/**
 * Observer calback
 * @param {*} entries
 */
const callback = entries => {
  entries.forEach(entry => {
    if (entry.intersectionRatio >= 0.7) {
      console.log("TCL: entry.target", entry.target);
      console.log("TCL: entry.isIntersecting", entry.isIntersecting);
      console.log("TCL: entry.intersectionRatio", entry.intersectionRatio);

      const rect = nav
        .querySelector(`[href="#${entry.target.id}"]`)
        .getBoundingClientRect();
      console.log("TCL: rect", rect);

      bubble.style.top = `${rect.top}px`;
      bubble.style.left = `${rect.left}px`;
      bubble.style.height = `${rect.height}px`;
      bubble.style.width = `${rect.width}px`;
    }
  });
};

/**
 * Start observing target elements
 */
const useSectionObserver = targets => {
  const observer = new IntersectionObserver(callback, { threshold: 0.7 });
  console.log("TCL: Header ->observer", observer);

  targets.forEach(target => observer.observe(target));
};

useSectionObserver(targets);

// return () => {
//   observerRef.current.disconnectAll();
// };
