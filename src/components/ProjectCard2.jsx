import React from 'react'
import './component.css'
import { FaShare } from "react-icons/fa";

const ProjectCard2 = ({ title, img, content, link }) => {
    return (
        <div class="cookieCard m-3">
            <h2 class="cookieHeading">{title}</h2>
            <p class="cookieDescription">
                {content.split(",").map((item, index) => { 
                    return <span key={index} className='tech_used'>{item}</span> 
                })}
            </p>
            <a href={link} target='_blank' class="acceptButton">Go to project <FaShare className='mx-2' /></a>
        </div>
    )
}

export default ProjectCard2
