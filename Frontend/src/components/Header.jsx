import React from 'react'
import { group_profiles , header_img , arrow_icon} from '../assets'



const Header = () => {
  return (
    <div className=' flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20 '>
        {/* left side */}
        <div className='md:w-1/2 flex flex-col justify-center items-start gap-4 m-auto py-10 md:py-[10vw] md:mb-[-30px]'>
            <p className='text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight md:leading-tight lg:leading-tight'>
                Expert Care You Can <br/> Trust, On Your <br/> Schedule.
            </p>
            <div className='flex flex-col md:flex-col gap-3 items-center text-white text-sm font-light'>
                <img className='w-28' src={group_profiles} alt="Group Profiles" />
                <p>Take control of your health. Browse verified <br className='hidden sm:block' /> specialists, read reviews, and secure your visit <br  /> instantly from one secure platform.</p>
            </div>

            <a className='flex items-center gap-2 bg-white  py-3 px-8 rounded-full text-gray-600 text-sm m-auto hover:scale-105 transition-all duration-300' href="#speciality">
                Book appointment
                <img className='w-3' src={arrow_icon} alt="arrow_icon" />
                
            </a>

        </div>
        {/* right side */}
        <div className='md:w-1/2 relative'>
            <img className='w-full md:absolute bottom-0 h-auto rounded-lg' src={header_img} alt="Header Image" />
        </div>
    </div>
  )
}

export default Header