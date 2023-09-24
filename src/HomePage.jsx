import React, { useEffect, useRef } from 'react'
import HeroContent from './components/HeroContent';
import NavbarComponent from './components/NavbarComponent';
import ContactComponent from './components/ContactComponent';
import { motion, useInView } from 'framer-motion';

const HomePage = () => {
    const leftRightSectionRef = useRef(null)
    const contactSectionRef = useRef(null)

    const leftRightSectionIsInView = useInView(leftRightSectionRef)
    const contactSectionIsInView = useInView(contactSectionRef)

    useEffect(() => {
        console.log(contactSectionIsInView)
    }, [leftRightSectionIsInView, contactSectionIsInView])


    return (
        <div>
            <NavbarComponent />
            <HeroContent />


            <section id="about-me" class="about-me">
                <div>
                    <div class="about-me-flex">
                        <div class="topp-left-about"></div>
                        <div class="top-left-about"></div>
                        <div class="about-me-content">
                            <div class="about-me-left-content">
                                <h2>About Me</h2>
                                <p>
                                    I am self motivated person passionate of coding. I am a dynamic and innovative web developer
                                    I thrive on transforming ideas into visually stunning and functional websites. My proactive
                                    approach enables me to anticipate and address potential challenges, ensuring smooth project
                                    execution and timely deliveryCollaborative by nature, I enjoy working closely with teams,
                                    valuing open communication and creative/productive environment.
                                </p>
                                <div class="bottom-right-about"></div>
                                <div class="bottomm-right-about"></div>
                            </div>
                            <div class="about-me-img">
                                <img src="/images/aboutimg.jpg" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section>
                <div id="skills" class="skills-section">
                    <div class="container section-container" ref={leftRightSectionRef}>
                        <motion.div class="skills-left w-50"
                            initial={{ x: -50, opacity: 0 }}
                            animate={leftRightSectionIsInView ? { x: 0, opacity: 1, transition: { duration: 0.5, delay: 0.3 } } : {}}>
                            <div>
                                <h9><span style={{ color: 'rgb(135, 206, 235)' }}>Favourite Skills</span></h9>
                                <h2>My <span style={{ color: 'rgb(135, 206, 235)' }}>Skills</span></h2>
                            </div>

                            <h5 class="mt-4" id="proj-desc">Have a glance over skills I have and what I can perform for your
                                project</h5>
                            <button class="btn mt-4">See Projects</button>
                        </motion.div>
                        <motion.div class="skills-right d-flex w-50 mt-5 justify-content-around"
                            initial={{ x: 50, opacity: 0, scale: 1 }}
                            animate={leftRightSectionIsInView ? { x: 0, opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.3 } } : {}}
                        >
                            <div class="skill-cont-1 d-flex flex-column justify-content-center">
                                <h6> <span style={{ color: 'rgb(135, 206, 235)' }}>01</span> HTML & CSS</h6>
                                <h6> <span style={{ color: 'rgb(135, 206, 235)' }}>02</span> Javascript</h6>
                                <h6> <span style={{ color: 'rgb(135, 206, 235)' }}>03</span> Node Js</h6>
                                <h6> <span style={{ color: 'rgb(135, 206, 235)' }}>04</span> Express</h6>
                                <h6> <span style={{ color: 'rgb(135, 206, 235)' }}>05</span> Mongo DB</h6>
                            </div>
                            <div class="skill-cont-2  d-flex flex-column justify-content-center">
                                <h6> <span style={{ color: 'rgb(135, 206, 235)' }}>06</span> Bootstrap</h6>
                                <h6> <span style={{ color: 'rgb(135, 206, 235)' }}>07</span> Tailwind CSS</h6>
                                <h6> <span style={{ color: 'rgb(135, 206, 235)' }}>07</span> Mongoose</h6>
                                <h6> <span style={{ color: 'rgb(135, 206, 235)' }}>07</span> Git</h6>
                                <h6> <span style={{ color: 'rgb(135, 206, 235)' }}>07</span> Git-Hub</h6>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section>
                <div id="services" style={{ backgroundColor: 'rgba(0, 0, 0, 0.911)' }}>
                    <div class="service-section d-flex flex-column">
                        <div class="service-heading p-3">
                            <h3>My <span style={{ color: 'rgb(135, 206, 235)' }}>Services</span></h3>
                            <h4 style={{ textAlign: 'center' }}>What I Do</h4>
                        </div>
                        <div class="service-card-container">
                            <div class="card">
                                <i class="fa fa-code mt-4"></i>
                                <div class="card-body">
                                    <h4 class="card-title">Frontent Developer</h4>
                                    <h3 style={{ color: 'rgb(135, 206, 235)' }}>I can build</h3>
                                    <ul style={{ margin: '1rem' }}>
                                        <li>The visually appealing website's interface</li>
                                        <li>Interactive and dynamic elements to your web pages</li>
                                        <li>Animations and form validation to complex frontend functionality</li>
                                        <li>A wide range of JavaScript development tasks</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="card">
                                <i class='fas fa-shield-alt mt-4'></i>
                                <div class="card-body">
                                    <h4 class="card-title">Backend Developer</h4>
                                    <h3 style={{ color: 'rgb(135, 206, 235)' }}>I can build</h3>
                                    <ul style={{ margin: '1rem' }}>
                                        <li>Restful API</li>
                                        <li>Manage the backend using MongoDb</li>
                                        <li>I specialize in server-side programming language like NodeJs</li>
                                        <li>I can seamlessly integrate third-party services</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="card">
                                <i class="fa fa-database mt-4"></i>
                                <div class="card-body">
                                    <h4 class="card-title">Database Management</h4>
                                    <h3 style={{ color: 'rgb(135, 206, 235)' }}>I can build</h3>
                                    <ul style={{ margin: '1rem' }}>
                                        <li>Database management using MongoDB</li>
                                        <li>Collection of data in ease and systematic way</li>
                                        <li>comprehensive database administration services, including monitoring, backups</li>
                                        <li>I prioritize data security</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ContactComponent contactSectionRef={contactSectionRef} contactSectionIsInView={contactSectionIsInView} />

        </div>
    )
}

export default HomePage
