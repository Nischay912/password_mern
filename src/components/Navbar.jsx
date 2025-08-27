import React from 'react'

const Navbar = () => {
  return (
    <nav className='bg-slate-800 text-white'>
        <div className="mycontainer flex justify-between items-center h-14 py-5">

            <div className="logo font-bold text-2xl">
                <span className="text-green-700">&lt;/</span>
                Pass
                <span className="text-green-500">OP</span>

                <span className="text-green-700">/&gt;</span>
            </div>
                <button className='bg-green-800 text-white flex items-center justify-between mx-2 my-5 rounded-full ring-1 ring-white'>
                    <img className='invert w-10 p-1' src="/icons/github.svg" alt="github logo" />
                    <span className='font-bold px-2'>GitHub</span>
                </button>
        </div>
    </nav>
  )
}

export default Navbar
