import React, { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion';
import { animateContact } from '../../utils/ContactAnimation';
import Typewriter from 'typewriter-effect';
const HeroContent = () => {
    const controls = useAnimation();

    function animateHeroContent() {
        gsap.from('.hero-content', { opacity: 0, y: 0, duration: 1, delay: 1.3 });
        gsap.from('.hero-img', { opacity: 0, y: 0, duration: 1, delay: 1.6 });
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


    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
        if (showMobileMenu) {
            setShowMobileMenu(false);
        }
    };

    return (
        <section id="hero" className="hero">
            <div className="hero-container d-flex flex-wrap">
                <div className="hero-content">
                    <h5>Hello,<span style={{ color: 'rgb(135, 206, 235)' }}> I'am</span></h5>
                    <h1 style={{ color: 'rgb(135, 206, 235)' }}>Jasvinder Singh</h1>
                    <h4>
                        <Typewriter
                            options={{
                                strings: ['Full Stack Developer', 'Freelancer', 'Programmer'],
                                autoStart: true,
                                loop: true,
                            }}
                        />
                    </h4>
                    <p className="pt-3">With the knowledge in software development and design, I offer the best projects resulting in
                        quality
                        work.</p>
                    <button disabled href='' className="btn" download>Download Resume</button>
                    <button id="projects-btn" className="btn-2 btn">
                        <button onClick={() => scrollToSection('about-me')} id="proj"
                            style={{ background: 'transparent', border: 'none' }}>About Me <i className="fa fa-arrow-right"></i>
                        </button>
                    </button>
                    <div className="hero-icons">
                        <a href="https://www.linkedin.com/in/jasvinder-singh-466a72256
"><i className="fa fa-linkedin fa-fade" style={{ fontSize: '28px' }}></i></a>
                        <a href="https://instagram.com/__jasvinder_singh100?igshid=MzNlNGNkZWQ4Mg=="><i
                            className="fa fa-instagram fa-fade" style={{ fontSize: '28px' }}></i></a>
                        <a href="https://github.com/singhJasvinder101"><i className="fa fa-github fa-fade"
                            style={{ fontSize: '28px' }}></i></a>
                    </div>
                </div>
                <img className='hero-img' src="/images/view-3d-businessman.jpg" alt="Your Photo" />
            </div >
            <i className="fa fa-paper-plane aeroplane" style={{ fontSize: '36px', color: 'white' }}></i>
        </section >
    );
}

export default HeroContent
