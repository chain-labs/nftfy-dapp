import { gsap, Power3, Power0 } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const scrollBannerAnimation = function () {
  gsap.fromTo(
    ".banner",
    {
      scale: 1,
      y: 0,
    },
    {
      scale: 1.5,
      y: -10,
      scrollTrigger: {
        trigger: ".body",
        // markers: true,
        scrub: true,
      },
    }
  );

  gsap.to(".body", {
    // clipPath: "polygon(0% 0%, 50% -4%, 100% 0%, 100% 100%, 0% 100%)",
    scrollTrigger: {
      trigger: ".body",
      scrub: true,
    },
  });
};

export const introAnimation = () => {
  gsap.fromTo(
    ".overlay",
    {
      yPercent: 0,
      // clipPath: "polygon(0% 0%, 50% 0%, 100% 0%, 100% 100%, 0% 100%)",
    },
    {
      // clipPath: "polygon(0% 0%, 50% 20%, 100% 0%, 100% 100%, 0% 100%)",
      yPercent: 100,
      duration: 0.8,
      ease: Power3.easeIn,
      onComplete: () => {
        // @ts-ignore
        document.querySelector(".overlay").style.display = "none";
      },
    }
  );

  gsap.fromTo(
    "#headline",
    { autoAlpha: 0, y: -20 },
    { autoAlpha: 1, y: 0, duration: 0.3, delay: 0.9, ease: Power0.easeInOut }
  );

  gsap.fromTo(
    ".cta-btn",
    { autoAlpha: 0, y: -20 },
    { autoAlpha: 1, y: 0, duration: 0.3, delay: 1.1, ease: Power0.easeInOut }
  );
};
