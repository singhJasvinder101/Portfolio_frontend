import React from 'react'
import { delay, motion, useAnimation } from 'framer-motion'
const apiUrl = import.meta.env.VITE_API_URI;
import axios from 'axios'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactComponent = ({ contactSectionRef, contactSectionIsInView }) => {

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.currentTarget.elements;
        const name = form.name.value
        const email = form.email.value
        const message = form.message.value
        try {
            const { data } = await axios.post(`${apiUrl}/submit`, { name, email, message }, {
                withCredentials: true
            })
            if (data.success) {
                toast.success("Message sent successfully", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "black",
                })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
            } else {
                toast.error("Message not sent", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                })
            }
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <motion.div id='contact' className="contact-section" ref={contactSectionRef}>
            <motion.h2
                className="section-title"
                style={{ color: 'rgb(135, 206, 235)' }}
                initial={{ opacity: 0, y: 50 }}
                animate={contactSectionIsInView ? { opacity: 1, y: 10 } : {}}
            >
                Contact Me
            </motion.h2>
            <motion.div
                className="contact-form"
                initial={{ opacity: 0, y: 50 }}
                animate={contactSectionIsInView ? { opacity: 1, y: 10, transition: { delay: 0.6, duration: 0.6 } } : {}}
            >
                <motion.form onSubmit={handleSubmit}>
                    <motion.div
                        className="form-group"
                        variants={{ hidden: { opacity: 0, y: 50, transition: { delay: 0.6, duration: 0.6 } }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                        initial="hidden"
                        animate={contactSectionIsInView ? "visible" : ""}
                    >
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" name="name" required />
                    </motion.div>
                    <motion.div
                        className="form-group"
                        variants={{ hidden: { opacity: 0, y: 50, transition: { delay: 0.6, duration: 0.6 } }, visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.6 } } }}
                        initial="hidden"
                        animate={contactSectionIsInView ? "visible" : ""}
                    >
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required />
                    </motion.div>
                    <motion.div
                        className="form-group"
                        variants={{ hidden: { opacity: 0, y: 50, transition: { delay: 0.6, duration: 0.6 } }, visible: { opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.6 } } }}
                        initial="hidden"
                        animate={contactSectionIsInView ? "visible" : ""}
                    >
                        <label htmlFor="message">Message</label>
                        <textarea id="message" name="message" required></textarea>
                    </motion.div>
                    <motion.button type="submit" className="btn contact-btn" initial={{ opacity: 0, scale: 0.5 }}
                        animate={contactSectionIsInView ? { opacity: 1, scale: 1, transition: { duration: 0.8 } } : {}}
                    >
                        <a>Send Message</a>
                    </motion.button>
                </motion.form>
            </motion.div>
        </motion.div>
    );
}

export default ContactComponent
