import React, { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion';
import { animateContact } from '../../utils/ContactAnimation';

const HeroContent = () => {
    const controls = useAnimation();

    function animateHeroContent() {
        gsap.from('.hero-content', { opacity: 0, y: 0, duration: 1, delay: 0 });
        gsap.from('.hero-img', { opacity: 0, y: 0, duration: 1, delay: 0 });
        gsap.set('.aeroplane', { x: window.innerWidth * 0.25, y: 0, opacity: 0 });

        gsap.registerPlugin(MotionPathPlugin);

        const tl = gsap.timeline({
            defaults: { ease: 'power1.out' },
            onComplete: () => {
                gsap.to('.hero-content', { opacity: 1, duration: 0.5, delay: 0.2 });
                gsap.to('.hero-img', { opacity: 1, duration: 0.5, delay: 0.7 });
            },
        });
        tl.to('.aeroplane', {
            x: '100vw', y: '-100vh', opacity: 1, duration: 2, delay: 1, motionPath: {
                path: [
                    { x: window.innerWidth * 0.25, y: -window.innerHeight * 0.01 },
                    { x: window.innerWidth * 0.35, y: -window.innerHeight * 0.0225 },
                    { x: window.innerWidth * 0.45, y: -window.innerHeight * 0.06 },
                    { x: window.innerWidth * 0.55, y: -window.innerHeight * 0.14 },
                    { x: window.innerWidth * 0.65, y: -window.innerHeight * 0.26 },
                    { x: window.innerWidth * 0.75, y: -window.innerHeight * 0.42 },
                    { x: window.innerWidth * 0.85, y: -window.innerHeight * 0.62 },
                    { x: window.innerWidth * 0.95, y: -window.innerHeight * 0.86 },
                    { x: window.innerWidth, y: -window.innerHeight },
                ],
            },
        });
    }
    useEffect(() => {
        window.addEventListener("load", () => {
            animateHeroContent()
            // animateContact()
        });
    }, [])

    return (
        <section id="hero" className="hero">
            <div className="hero-container">
                <div className="hero-content">
                    <h5>Hello,<span style={{ color: 'rgb(135, 206, 235)' }}> I'am</span></h5>
                    <h1 style={{ color: 'rgb(135, 206, 235)' }}>Jasvinder Singh</h1>
                    <h4>Full-Stack Web Developer</h4>
                    <p className="pt-3">With the knowledge in web development and design, I offer the best projects resulting in
                        quality
                        work.</p>
                    <div id="hero-btns" className="mt-5 d-flex">
                        <button className="btn">Download Resume</button>
                        <button id="projects-btn" className="btn mx-3">
                            <a href="projects" id="proj"
                                style={{ listStyle: 'none' }}>Projects <i className="fa fa-arrow-right"></i>
                            </a>
                        </button>
                    </div>
                    <div className="hero-icons">
                        <a href="https://www.linkedin.com/in/jasvinder-singh-466a72256
"><i className="fa fa-linkedin fa-fade" style={{ fontSize: '28px' }}></i></a>
                        <a href="https://instagram.com/__jasvinder_singh100?igshid=MzNlNGNkZWQ4Mg=="><i
                            className="fa fa-instagram fa-fade" style={{ fontSize: '28px' }}></i></a>
                        <a href="https://github.com/singhJasvinder101"><i className="fa fa-github fa-fade"
                            style={{ fontSize: '28px' }}></i></a>
                    </div>
                </div>
                <img className='hero-img' src="/images/myimg2.png" alt="Your Photo" />
            </div >
            <i className="fa fa-paper-plane aeroplane" style={{ fontSize: '36px', color: 'white' }}></i>
        </section >
    );
}

export default HeroContent
