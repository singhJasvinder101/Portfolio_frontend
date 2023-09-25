import React, { useEffect, useState } from 'react'
import { delay, motion, useAnimation } from 'framer-motion'

const NavbarComponent = () => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);


    const toggleMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu);
    };  

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
        if (showMobileMenu) {
            setShowMobileMenu(false);
        }
    };



    const navbarVariants = {
        sticky: {
            top: 0,
            position: 'sticky',
            // backgroundColor: 'rgba(245, 245, 245, 0.645)',
            backgroundColor: '#f1f6ff',
            opacity: 0.8,
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)',
            zIndex: 100,
        },
        normal: {
            top: '-100px',
            position: 'static',
            backgroundColor: 'transparent',
            boxShadow: 'none',
            opacity: 1,
        },
    };

    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <motion.div
            initial={isSticky ? 'sticky' : 'normal'}
            animate={isSticky ? 'sticky' : 'normal'}
            variants={navbarVariants}
            className={`App ${showMobileMenu ? 'mobile-menu-active' : ''}`}
        >
            <header>
                <nav className="navbar">
                    <div className="required">
                        <div className="logo pt-2">
                            Jasvinder Singh
                        </div>
                        <ul className={`links ${showMobileMenu ? 'inactive' : 'active'}`}>
                            <li><button onClick={() => scrollToSection('hero')} style={{ margin: 'auto' }}>Home</button></li>
                            <li><button onClick={() => scrollToSection('about-me')}>About</button></li>
                            <li><button onClick={() => scrollToSection('services')}>Services</button></li>
                            <li><button onClick={() => scrollToSection('skills')}>Skills</button></li>
                            <li><button onClick={() => scrollToSection('contact')}>Contact</button></li>
                        </ul>
                    </div>
                    <div>
                        <button className="chat btn" onClick={() => scrollToSection('contact')} style={{ color: 'black' }}>
                            Let's Chat
                            <span><i className="ri-arrow-right-up-line"></i></span>
                        </button>
                    </div>
                    <div className={`nav-btn mx-2 ${showMobileMenu ? 'btn-inactive' : 'btn-active'}`}
                        style={{ height: '2rem' }}
                        onClick={toggleMobileMenu}>
                        {showMobileMenu ?
                            <i className="fas fa-bars" style={{ fontSize: '1.5rem' }}></i> :
                            <i className="fas fa-times" style={{ fontSize: '1.5rem' }}></i>
                        }
                    </div>
                </nav>
            </header>

        </motion.div>
    )
}

export default NavbarComponent
