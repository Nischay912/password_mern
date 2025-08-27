import React from 'react'

const Footer = () => {
  return (
    <div className='bg-slate-800 text-white flex flex-col justify-center items-center w-full bottom-0'>
        
        <div className="logo font-bold text-2xl text-white">
                <span className="text-green-700">&lt;/</span>
                Pass
                <span className="text-green-500">OP</span>
                <span className="text-green-700">/&gt;</span>
        </div>
        <div className='flex justify-center items-center'>
            Created with <img className='w-7 mx-2' src="/icons/heart.png" alt="" /> using React and Tailwind
        </div>
    </div>
  )
}

export default Footer
