import React from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';

const Navbar = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const { openSignIn } = useClerk();

    return (
        <div className='fixed z-50 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32'>
            <NavLink to="/" className='flex items-center w-32 sm:w-44'>
                <img 
                    src={assets.logo} 
                    alt="logo" 
                    className='w-full h-auto' 
                />
            </NavLink>

            {user ? (
                <UserButton afterSignOutUrl="/" />
            ) : (
                <button
                    className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5"
                    onClick={() => openSignIn()}
                >
                    Get Started <ArrowRight className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}

export default Navbar;