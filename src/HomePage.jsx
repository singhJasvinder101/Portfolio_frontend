import React, { useEffect, useRef } from 'react'
import HeroContent from './components/HeroContent';
import NavbarComponent from './components/NavbarComponent';
import ContactComponent from './components/ContactComponent';
import { motion, useInView } from 'framer-motion';
import ProjectCardComponent from './components/ProjectCardComponent';
import ProjectCard2 from './components/ProjectCard2';
import { FaShare } from 'react-icons/fa';

const HomePage = () => {
    const leftRightSectionRef = useRef(null)
    const contactSectionRef = useRef(null)
    const experianceSection = useRef(null)
    const aboutMeSection = useRef(null)

    const leftRightSectionIsInView = useInView(leftRightSectionRef)
    const contactSectionIsInView = useInView(contactSectionRef)
    const experianceSectionisInView = useInView(experianceSection)
    const aboutMeSectionisInView = useInView(aboutMeSection)

    useEffect(() => {
        // console.log(contactSectionIsInView)
    }, [leftRightSectionIsInView, contactSectionIsInView, experianceSectionisInView])


    return (
        <div>
            <NavbarComponent />
            <HeroContent />


            <section id="about-me" class="about-me">
                <div>
                    <div class="about-me-flex" ref={aboutMeSection}>
                        <div class="about-me-content">
                            <div class="about-me-img">
                                <img src="/images/professional-programmer-writing.jpg" alt="" />
                            </div>
                            <div class="about-me-left-content">
                                <motion.h2
                                    initial={{ opacity: 0, y: -50 }}
                                    animate={aboutMeSectionisInView ? { opacity: 1, y: 0, transition: { duration: 0.3 } } : {}}
                                >About Me</motion.h2>
                                <p>
                                    I am self motivated person passionate of coding. I am a dynamic and innovative web developer
                                    I thrive on transforming ideas into visually stunning and functional websites. My proactive
                                    approach enables me to anticipate and address potential challenges, ensuring smooth project
                                    execution and timely delivery. I enjoy working closely with teams,
                                    valuing open communication and creative/productive environment.
                                </p>
                                <div class="bottom-right-about"></div>
                                <div class="bottomm-right-about"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section>
                <div id="skills" class="skills-section">
                    <div class="container section-container" ref={leftRightSectionRef}>
                        <motion.div class="skills-left w-50"
                            initial={{ x: -30, opacity: 0 }}
                            animate={leftRightSectionIsInView ? { x: 0, opacity: 1, transition: { duration: 0.5, delay: 0.3 } } : {}}>
                            <div>
                                <h9><span style={{ color: 'rgb(135, 206, 235)' }}>Favourite Skills</span></h9>
                                <h2>My <span style={{ color: 'rgb(135, 206, 235)' }}>Skills</span></h2>
                            </div>

                            <h5 class="mt-4" id="proj-desc">Have a glance over skills I have and what I can perform for your
                                project</h5>
                        </motion.div>
                        <motion.div class="skills-right d-flex w-50 mt-5 justify-content-around"
                            initial={{ x: 30, opacity: 0, scale: 1 }}
                            animate={leftRightSectionIsInView ? { x: 0, opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.3 } } : {}}
                        >
                            <div class="skill-cont-1 d-flex flex-column justify-content-center">
                                <h6> <span style={{ color: 'rgb(135, 206, 235)' }}>01</span> React.js</h6>
                                <h6> <span style={{ color: 'rgb(135, 206, 235)' }}>02</span> Next.js</h6>
                                <h6> <span style={{ color: 'rgb(135, 206, 235)' }}>03</span> Node Js</h6>
                                <h6> <span style={{ color: 'rgb(135, 206, 235)' }}>04</span> Mongo DB</h6>
                                <h6> <span style={{ color: 'rgb(135, 206, 235)' }}>05</span> Javscript </h6>
                                <h6> <span style={{ color: 'rgb(135, 206, 235)' }}>06</span> Typescript </h6>
                            </div>
                            <div class="skill-cont-2  d-flex flex-column justify-content-center">
                                <h6> <span style={{ color: 'rgb(135, 206, 235)' }}>07</span> Tailwind </h6>
                                <h6> <span style={{ color: 'rgb(135, 206, 235)' }}>08</span> Prisma </h6>
                                <h6> <span style={{ color: 'rgb(135, 206, 235)' }}>09</span> WebRTC </h6>
                                <h6> <span style={{ color: 'rgb(135, 206, 235)' }}>10</span> Django </h6>
                                <h6> <span style={{ color: 'rgb(135, 206, 235)' }}>11</span> Zustand </h6>
                                <h6> <span style={{ color: 'rgb(135, 206, 235)' }}>12</span> Flask </h6>
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

            <section>
                <div className='projects projects-section' style={{ backgroundColor: 'black' }}>
                    <div className="projects-heading">
                        <h2 className='text-light p-3 text-center'>My <span style={{ color: 'rgb(135, 206, 235)' }}>Projects</span></h2>
                    </div>
                    <div className="project-cards d-flex justify-content-around flex-wrap py-3">
                        <ProjectCard2
                            title={"Tech Stuffs"}
                            content={"MongoDb, React, Nodejs, Bootstrap, Robust Api, Authentication"}
                            img={"/images/blog.jpg"}
                            link={"https://tech-stuffs.netlify.app/"}
                        />
                        <ProjectCard2
                            title={"File Sharing Web App"}
                            content={"WebRTC, Next.js, Socket.io, React.js, Typescript"}
                            img={"/images/chatting.jpg"}
                            link={"https://github.com/singhJasvinder101/XShare"}
                        />
                        <ProjectCard2
                            title={"Free Movies Streaming Website"}
                            content={"TanstackQuery, React, Tailwind, Bootstrap, Nodejs, MongoDB, Authentication"}
                            img={"/images/movies.jpg"}
                            link={"https://series-addict.netlify.app/"}
                        />
                        <ProjectCard2
                            title={"Real-Time Chat Application"}
                            content={"React, socket.io, Nodejs, Tailwind, MongoDB, Bootstrap"}
                            img={"/images/chatting.jpg"}
                            link={"https://x-chat-talks.netlify.app/"}
                        />
                        <ProjectCard2
                            title={"Barbershop Site"}
                            decription={"Demo of project build during internship in startup "}
                            content={" React, Framer-Motion, Tailwind CSS, Animations, UI"}
                            img={"/images/chatting.jpg"}
                            link={"https://demopage-xi.vercel.app/"}
                        />
                    </div>
                    {/* <div className="projects-heading">
                        <p className='text-light p-3 text-center'>more <span style={{ color: 'rgb(135, 206, 235)' }}>Projects</span></p>
                    </div>
                    <div className="minor-projects container overflow-scroll">
                        <div>
                            <h4 href='https://quizz-app-brown-nine.vercel.app/' className='p-2' style={{ color: 'rgb(135, 206, 235)' }}>Quizz App <FaShare /></h4>
                            <p className='text-white fs-6 px-2 pb-1'>save your progress, user friendly and stunning ui, result access, categories of tests</p>
                            <p className='text-white px-2'>
                                Tech Used:
                                <ul className='d-flex'>
                                    <li>React.js</li>
                                    <li>Tailwind CSS</li>
                                    <li>Zustand</li>
                                </ul>
                            </p>
                        </div>
                        <div>
                            <h4 href='' className='p-2' style={{ color: 'rgb(135, 206, 235)' }}>Online Compiler <FaShare /></h4>
                            <p className='text-white fs-6 px-2 pb-3'>various programming language compatible and customizable themes, fonts and web editor (new) more features to be added later</p>
                            <p className='text-white px-2'>
                                Tech Used:
                                <ul className='d-flex flex-wrap'>
                                    <li>React.js</li>
                                    <li>Mongodb</li>
                                    <li>Nodejs</li>
                                    <li>Tailwind CSS</li>
                                </ul>
                            </p>
                        </div>
                    </div> */}
                </div>
            </section>

            <section>
                <div id="experiance" ref={experianceSection} style={{ backgroundColor: 'rgba(0, 0, 0, 0.911)' }}>
                    <h2 className='text-light p-3 text-center'>My <span style={{ color: 'rgb(135, 206, 235)' }}>Experiance</span></h2>
                    <div className="certificates container d-flex justify-content-between flex-wrap">
                        <div className="my-4">
                            <motion.img
                                className=''
                                initial={{ scale: 0, opacity: 0 }}
                                animate={experianceSectionisInView ? { scale: 1, opacity: 1, transition: { delay: 0.1, duration: 0.6 } } : {}}
                                src="/images/SamarpanCertificate.jpg"
                                alt=""
                            />
                        </div>
                        <div className="my-4">
                            <motion.img
                                initial={{ scale: 0, opacity: 0 }}
                                animate={experianceSectionisInView ? { scale: 1, opacity: 1, transition: { delay: 0.4, duration: 0.6 } } : {}}
                                className=''
                                src="/images/AlliedgeTechnologiesCertificate.png"
                                alt=""
                            />
                        </div>
                        <div className="my-4 lastImage">
                            <motion.img
                                initial={{ scale: 0, opacity: 0 }}
                                animate={experianceSectionisInView ? { scale: 1, opacity: 1, transition: { delay: 0.4, duration: 0.6 } } : {}}
                                className=''
                                src="/images/TDP Vista certificate.jpg"
                                alt=""
                            />
                        </div>
                    </div>
                </div>
            </section>

            <ContactComponent contactSectionRef={contactSectionRef} contactSectionIsInView={contactSectionIsInView} />

        </div>
    )
}

export default HomePage
