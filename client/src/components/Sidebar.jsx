import React from 'react'
import { Protect, useClerk, useUser } from '@clerk/clerk-react'
import { assets } from '../assets/assets';
import { Eraser, House, Scissors, SquarePen, Hash, Image, FileText, Users, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
    {to: '/ai' , label: 'Dashboard', icon: House},
    {to: '/ai/write-article' , label: 'Write Article', icon: SquarePen},
    {to: '/ai/blog-titles' , label: 'Blog Titles', icon: Hash},
    {to: '/ai/generate-images' , label: 'Generate Images', icon: Image},
    {to: '/ai/remove-background' , label: 'Remove Background', icon: Eraser},
    {to: '/ai/remove-object' , label: 'Remove Object', icon: Scissors},
    {to: '/ai/reviwe-resume' , label: 'Reviwe Resume', icon: FileText},
    {to: '/ai/community' , label: 'Community', icon: Users}
];


const Sidebar = ({sidebar, setSidebar}) => {

    const { user } = useUser();
    const { signOut, openUserProfile } = useClerk();

    if (!user) {
      return (
        <div className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'} transition-all duration-300 ease-in-out`}>
          <div className='my-7 w-full text-center'>
            <div className='w-13 h-13 rounded-full mx-auto bg-gray-200 animate-pulse mb-2'></div>
            <h1 className='mt-1 text-gray-400'>Loading...</h1>
          </div>
        </div>
      );
    }

    return (
      <div className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'} transition-all duration-300 ease-in-out`}>
        <div className='my-7 w-full'>
          <img src={user.imageUrl} alt="User avatar" className='w-13 rounded-full mx-auto' />
          <h1 className='mt-1 text-center'>{user.fullName}</h1>
          <div className='px-6 mt-5 text-sm text-gray-600 font-medium'>
            {navItems.map(({to , label, icon: Icon}) => (
                <NavLink key={to} to={to} end={to === '/ai'} onClick={() => setSidebar(false)} className={({isActive})=> `px-3.5 py-2.5 flex items-center gap-3 rounded ${isActive ? 'bg-gradient-to-r from-0[#3C81F6] to-[#9234EA] text-white' : '' } `}
                >
                    {({isActive})=> (
                        <>
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                        {label}
                        </>
                    )}

                </NavLink>
            ))}
          </div>
        </div>
        <div className='w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between'>
            <div className='flex items-center gap-2 cursor-pointer' onClick={openUserProfile}>
                <img src={user.imageUrl} alt="" className='w-8 rouneded-full'/>
                <div>
                    <h1 className='text-sm font-medium'>
                        {user.fullName}
                    </h1>
                    <p className='text-xs text-gray-500'>
                    <Protect plan='Premium' fallback='Free'>
                        Premium
                    </Protect>
                    Plan
                    </p>
                   
                </div>

            </div>
            <LogOut onClick={signOut} className='w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer ' />

        </div>
      </div>
    );
} 

export default Sidebar
