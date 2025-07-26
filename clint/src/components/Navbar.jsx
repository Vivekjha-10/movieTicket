import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useUser()
    const { openSignIn } = useClerk()
    const navigate = useNavigate()

    const {favoriteMovies} = useAppContext();   

    return (
        <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5 bg-white/10'>

            {/* Main logo (hamesha dikh raha hai) */}
            <Link to='/' className='max-md:flex-1'>
                <img src={assets.logo} alt='' className='w-36 h-auto' />
            </Link>

            {/* Mobile + Desktop Menu */}
            <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center 
                max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur
                bg-black/70 md:bg-white/10 md:border border-gray-300/20 
                 text-white md:text-white transition-all duration-300 ease-in-out 
                ${isOpen ? 'max-md:w-full' : 'max-md:w-0'} overflow-hidden`}
            >

                {/* ✅ Logo visible only in mobile menu when open */}
                {isOpen && (
                    <Link to='/' className='absolute top-5 left-6 md:hidden'>
                        <img src={assets.logo} alt='logo' className='w-28 h-auto' />
                    </Link>
                )}

                {/* Close button */}
                <XIcon
                    className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer'
                    onClick={() => setIsOpen(!isOpen)}
                />

                {/* Menu links */}
                <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to='/'>Home</Link>
                <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to='/movies'>Movies</Link>
                <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to='/'>Theathers</Link>
                <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to='/'>Releases</Link>
                {/* <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to='/favorite'>Favorates</Link> */}
                {favoriteMovies.length > 0 && <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to='/favorite'>Favorates</Link>}
            </div>

            {/* Right side - search and login */}
            <div className='flex items-center gap-8'>
                <SearchIcon className='max-md:hidden w-6 h-6 cursor-pointer text-white' />
                {
                    !user ? (
                        <button onClick={openSignIn} className='px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer text-white'>
                            Login
                        </button>
                    ) : (
                        <UserButton >
                            <UserButton.MenuItems>
                                <UserButton.Action label='My Bookings' 
                                labelIcon={<TicketPlus width={15} />}  onClick={ () => navigate('/my-bookings')}/>
                            </UserButton.MenuItems>
                        </UserButton>
                    )
                }

            </div>

            {/* Hamburger icon for mobile */}
            <MenuIcon
                className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer text-white'
                onClick={() => setIsOpen(!isOpen)}
            />
        </div>
    );
};

export default Navbar;
