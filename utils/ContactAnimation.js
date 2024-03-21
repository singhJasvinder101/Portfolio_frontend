
export function animateContact() {
    gsap.registerPlugin(ScrollTrigger);
    const titleAnimation = gsap.from(".section-title", {
        opacity: 0,
        y: 50,
        duration: 1,
    });
    const formAnimation = gsap.from(".contact-form", {
        opacity: 0,
        y: 50,
        duration: 1,
    });
    const formGroupAnimation = gsap.from(".form-group", {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2,
    });
    const buttonAnimation = gsap.from("button.btn", {
        opacity: 0,
        scale: 0.5,
        duration: 0.8,
    });
    ScrollTrigger.create({
        trigger: ".contact-section",
        start: "top 80%",
        onEnter: () => {
            titleAnimation.restart();
            formAnimation.restart();
            formGroupAnimation.restart();
            buttonAnimation.restart();
        }
    });
}

