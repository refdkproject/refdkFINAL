'use client';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/logo.jpeg';
import saudiFlag from '../assets/images/Flag-Saudi-Arabia.webp';
import defaultProfilePic from '../assets/images/default-profile-pic.png';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [institutionsOpen, setInstitutionsOpen] = useState(false);
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    // Close all dropdowns when route changes
    setInstitutionsOpen(false);
    setActivitiesOpen(false);
    setResourcesOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // Close mobile menu on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (path: string) => location.pathname === path || (location.pathname.startsWith(path) && path !== '/');

  // Toggle dropdown and close others
  const toggleDropdown = (dropdown: any) => {
    if (dropdown === 'institutions') {
      setInstitutionsOpen(!institutionsOpen);
      setActivitiesOpen(false);
      setResourcesOpen(false);
    } else if (dropdown === 'activities') {
      setActivitiesOpen(!activitiesOpen);
      setInstitutionsOpen(false);
      setResourcesOpen(false);
    } else if (dropdown === 'resources') {
      setResourcesOpen(!resourcesOpen);
      setInstitutionsOpen(false);
      setActivitiesOpen(false);
    } else if (dropdown === 'profile') {
      setProfileOpen(!profileOpen);
    }
  };

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (!event.target.closest('.dropdown-container')) {
        setInstitutionsOpen(false);
        setActivitiesOpen(false);
        setResourcesOpen(false);
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={`w-full bg-white fixed top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}
    >
      <div className='mx-auto px-4 sm:px-6 lg:px-12'>
        <div className='flex items-center justify-between h-16 sm:h-20'>
          {/* Logo section */}
          <div className='flex items-center gap-2 sm:gap-3'>
            <Link to='/' className='flex items-center gap-2'>
              <img
                src={logo || '/placeholder.svg'}
                alt='REFDK Logo'
                className='w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover'
              />
              <img
                src={saudiFlag || '/placeholder.svg'}
                alt='Saudi Flag'
                className='w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover'
              />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className='md:hidden text-gray-700 focus:outline-none'
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>

          {/* Navigation */}
          <nav
            className={`
              ${isMobileMenuOpen ? 'flex' : 'hidden'} 
              md:flex flex-col md:flex-row md:items-center gap-1 sm:gap-2
              absolute md:static top-16 sm:top-20 left-0 right-0
              w-full md:w-auto bg-white md:bg-transparent 
              shadow-lg md:shadow-none z-10
              max-h-[calc(100vh-4rem)] md:max-h-full overflow-y-auto md:overflow-visible
              py-4 md:py-0 px-4 md:px-0
              transition-all duration-300
              text-xs sm:text-sm
            `}
          >
            <Link
              to='/'
              className={`nav-link hover:bg-[#397260] px-2 py-1.5 rounded-full hover:text-white transition-colors
                ${isActive('/') ? 'text-[#397260] font-medium' : 'text-gray-700'}
                block md:inline-block text-left w-full md:w-auto
              `}
            >
              Home
            </Link>

            {!user && (
              <Link
                to='/join'
                className={`nav-link hover:bg-[#397260] px-2 py-1.5 rounded-full hover:text-white transition-colors
                  ${isActive('/join') ? 'text-[#397260] font-medium' : 'text-gray-700'}
                  block md:inline-block text-left w-full md:w-auto mt-1 md:mt-0
                `}
              >
                Join Our Team
              </Link>
            )}

            {user ? (
              user.role === 'volunteer' ? (
                <>
                  {/* Institutions Group */}
                  <div className='dropdown-container relative'>
                    <button
                      onClick={() => toggleDropdown('institutions')}
                      className={`flex items-center justify-between gap-1 px-2 py-1.5 rounded-full hover:bg-[#397260] hover:text-white transition-colors
                        ${
                          isActive('/institution-engagement') || isActive('/institutions')
                            ? 'text-[#397260] font-medium'
                            : 'text-gray-700'
                        }
                        block text-left w-full md:w-auto mt-1 md:mt-0
                      `}
                    >
                      <span>Institutions</span>
                      <svg
                        className={`h-3 w-3 opacity-70 transition-transform ${institutionsOpen ? 'rotate-180' : ''}`}
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                      </svg>
                    </button>
                    {institutionsOpen && (
                      <div className='absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20'>
                        <div className='py-1' role='menu' aria-orientation='vertical'>
                          <Link
                            to='/institution-engagement'
                            className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                            role='menuitem'
                          >
                            Institution Engagement
                          </Link>
                          <Link
                            to='/institutions'
                            className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                            role='menuitem'
                          >
                            Charity Center
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Activities Group */}
                  <div className='dropdown-container relative'>
                    <button
                      onClick={() => toggleDropdown('activities')}
                      className={`flex items-center justify-between gap-1 px-2 py-1.5 rounded-full hover:bg-[#397260] hover:text-white transition-colors
                        ${
                          isActive('/events') ||
                          isActive('/event-detail') ||
                          isActive('/scheduled-events') ||
                          isActive('/wishlist') ||
                          isActive('/add-wishlist') ||
                          isActive('/track')
                            ? 'text-[#397260] font-medium'
                            : 'text-gray-700'
                        }
                        block text-left w-full md:w-auto mt-1 md:mt-0
                      `}
                    >
                      <span>Activities</span>
                      <svg
                        className={`h-3 w-3 opacity-70 transition-transform ${activitiesOpen ? 'rotate-180' : ''}`}
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                      </svg>
                    </button>
                    {activitiesOpen && (
                      <div className='absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20'>
                        <div className='py-1' role='menu' aria-orientation='vertical'>
                          <Link
                            to='/events'
                            className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                            role='menuitem'
                          >
                            Events
                          </Link>
                          <Link
                            to='/wishlist'
                            className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                            role='menuitem'
                          >
                            WishList
                          </Link>
                          <Link
                            to='/track'
                            className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                            role='menuitem'
                          >
                            Attendance
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Resources Group */}
                  <div className='dropdown-container relative'>
                    <button
                      onClick={() => toggleDropdown('resources')}
                      className={`flex items-center justify-between gap-1 px-2 py-1.5 rounded-full hover:bg-[#397260] hover:text-white transition-colors
                        ${
                          isActive('/news-feed') || isActive('/training')
                            ? 'text-[#397260] font-medium'
                            : 'text-gray-700'
                        }
                        block  text-left w-full md:w-auto mt-1 md:mt-0
                      `}
                    >
                      <span>Resources</span>
                      <svg
                        className={`h-3 w-3 opacity-70 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`}
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                      </svg>
                    </button>
                    {resourcesOpen && (
                      <div className='absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20'>
                        <div className='py-1' role='menu' aria-orientation='vertical'>
                          <Link
                            to='/news-feed'
                            className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                            role='menuitem'
                          >
                            News Feed
                          </Link>
                          <Link
                            to='/training'
                            className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                            role='menuitem'
                          >
                            Trainings
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                  <Link
                    to='/chat'
                    className={`nav-link hover:bg-[#397260] px-2 py-1.5 rounded-full hover:text-white transition-colors
                        ${isActive('/chat') ? 'text-[#397260] font-medium' : 'text-gray-700'}
                        block md:inline-block text-left w-full md:w-auto mt-1 md:mt-0
                      `}
                  >
                    Chat
                  </Link>

                  {/* Profile Dropdown */}
                  <div className='dropdown-container md:ml-2 mt-3 md:mt-0 border-t md:border-t-0 pt-3 md:pt-0 relative'>
                    <button
                      onClick={() => toggleDropdown('profile')}
                      className={`text-sm sm:text-base flex items-center gap-2 text-gray-700 hover:text-[#397260] transition-colors rounded-full p-1 hover:bg-gray-100 focus:outline-none
                        ${isActive('/profile') ? 'text-[#397260] font-medium' : ''}
                        w-full md:w-auto
                      `}
                    >
                      <div className='flex items-center gap-2 flex-grow'>
                        <img
                          src={user.profilePic || defaultProfilePic}
                          alt='Profile'
                          className='w-8 h-8 rounded-full object-cover flex-shrink-0'
                        />
                        <span className='md:max-w-[100px] lg:max-w-none truncate'>{user.name}</span>
                      </div>
                      <svg
                        className={`h-4 w-4 opacity-70 transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                      </svg>
                    </button>

                    {profileOpen && (
                      <div className='absolute right-0 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20'>
                        <div className='py-1' role='menu' aria-orientation='vertical'>
                          <Link
                            to='/profile'
                            className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                            role='menuitem'
                          >
                            <svg
                              className='mr-2 h-4 w-4'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                              />
                            </svg>
                            <span>Profile</span>
                          </Link>
                          <hr className='my-1' />
                          <button
                            onClick={() => {
                              logout();
                              navigate('/');
                            }}
                            className='flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
                            role='menuitem'
                          >
                            <svg
                              className='mr-2 h-4 w-4'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                              />
                            </svg>
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Admin Institutions Group */}
                  <div className='dropdown-container relative'>
                    <button
                      onClick={() => toggleDropdown('institutions')}
                      className={`flex items-center justify-between gap-1 px-2 py-1.5 rounded-full hover:bg-[#397260] hover:text-white transition-colors
                        ${
                          isActive('/admin/institution-engagement') ||
                          isActive('/admin/add-institution-engagement') ||
                          isActive('/admin/update-institution-engagement') ||
                          isActive('/admin/institutions')
                            ? 'text-[#397260] font-medium'
                            : 'text-gray-700'
                        }
                        block text-left w-full md:w-auto mt-1 md:mt-0
                      `}
                    >
                      <span>Institutions</span>
                      <svg
                        className={`h-3 w-3 opacity-70 transition-transform ${institutionsOpen ? 'rotate-180' : ''}`}
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                      </svg>
                    </button>
                    {institutionsOpen && (
                      <div className='absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20'>
                        <div className='py-1' role='menu' aria-orientation='vertical'>
                          <Link
                            to='/admin/institution-engagement'
                            className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                            role='menuitem'
                          >
                            Institution Engagement
                          </Link>
                          <Link
                            to='/admin/institutions'
                            className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                            role='menuitem'
                          >
                            Charity Center
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Admin Activities Group */}
                  <div className='dropdown-container relative'>
                    <button
                      onClick={() => toggleDropdown('activities')}
                      className={`flex items-center justify-between gap-1 px-2 py-1.5 rounded-full hover:bg-[#397260] hover:text-white transition-colors
                        ${
                          isActive('/admin/events') ||
                          isActive('/admin/view-event/') ||
                          isActive('/admin/add-event') ||
                          isActive('/admin/update-event') ||
                          isActive('/admin/wishlist') ||
                          isActive('/admin/add-wishlist') ||
                          isActive('/admin/update-wishlist')
                            ? 'text-[#397260] font-medium'
                            : 'text-gray-700'
                        }
                        block text-left w-full md:w-auto mt-1 md:mt-0
                      `}
                    >
                      <span>Activities</span>
                      <svg
                        className={`h-3 w-3 opacity-70 transition-transform ${activitiesOpen ? 'rotate-180' : ''}`}
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                      </svg>
                    </button>
                    {activitiesOpen && (
                      <div className='absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20'>
                        <div className='py-1' role='menu' aria-orientation='vertical'>
                          <Link
                            to='/admin/events'
                            className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                            role='menuitem'
                          >
                            Events
                          </Link>
                          <Link
                            to='/admin/wishlist'
                            className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                            role='menuitem'
                          >
                            WishList
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Admin Resources Group */}
                  <div className='dropdown-container relative'>
                    <button
                      onClick={() => toggleDropdown('resources')}
                      className={`flex items-center justify-between gap-1 px-2 py-1.5 rounded-full hover:bg-[#397260] hover:text-white transition-colors
                        ${
                          isActive('/admin/news-feed') ||
                          isActive('/admin/training') ||
                          isActive('/admin/add-training') ||
                          isActive('/admin/update-training')
                            ? 'text-[#397260] font-medium'
                            : 'text-gray-700'
                        }
                        block text-left w-full md:w-auto mt-1 md:mt-0
                      `}
                    >
                      <span>Resources</span>
                      <svg
                        className={`h-3 w-3 opacity-70 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`}
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                      </svg>
                    </button>
                    {resourcesOpen && (
                      <div className='absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20'>
                        <div className='py-1' role='menu' aria-orientation='vertical'>
                          <Link
                            to='/admin/news-feed'
                            className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                            role='menuitem'
                          >
                            News Feed
                          </Link>
                          <Link
                            to='/admin/training'
                            className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                            role='menuitem'
                          >
                            Trainings
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  <Link
                    to='/chat'
                    className={`nav-link hover:bg-[#397260] px-2 py-1.5 rounded-full hover:text-white transition-colors
                        ${isActive('/chat') ? 'text-[#397260] font-medium' : 'text-gray-700'}
                        block md:inline-block text-left w-full md:w-auto mt-1 md:mt-0
                      `}
                  >
                    Chat
                  </Link>

                  {/* Admin Profile Dropdown */}
                  <div className='dropdown-container md:ml-2 mt-3 md:mt-0 border-t md:border-t-0 pt-3 md:pt-0 relative'>
                    <button
                      onClick={() => toggleDropdown('profile')}
                      className={`text-sm sm:text-base flex items-center gap-2 text-gray-700 hover:text-[#397260] transition-colors rounded-full p-1 hover:bg-gray-100 focus:outline-none
                        ${isActive('/profile') ? 'text-[#397260] font-medium' : ''}
                        w-full md:w-auto
                      `}
                    >
                      <div className='flex items-center gap-2 flex-grow'>
                        <img
                          src={user.profilePic || defaultProfilePic}
                          alt='Profile'
                          className='w-8 h-8 rounded-full object-cover flex-shrink-0'
                        />
                        <span className='md:max-w-[100px] lg:max-w-none truncate'>{user.name}</span>
                      </div>
                      <svg
                        className={`h-4 w-4 opacity-70 transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                      </svg>
                    </button>
                    {profileOpen && (
                      <div className='absolute right-0 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20'>
                        <div className='py-1' role='menu' aria-orientation='vertical'>
                          <Link
                            to='/profile'
                            className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                            role='menuitem'
                          >
                            <svg
                              className='mr-2 h-4 w-4'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                              />
                            </svg>
                            <span>Profile</span>
                          </Link>
                          <hr className='my-1' />
                          <button
                            onClick={() => {
                              logout();
                              navigate('/');
                            }}
                            className='flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
                            role='menuitem'
                          >
                            <svg
                              className='mr-2 h-4 w-4'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                              />
                            </svg>
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )
            ) : (
              <Link
                to='/login'
                className={`nav-link hover:bg-[#397260] px-2 py-1.5 rounded-full hover:text-white transition-colors
    ${isActive('/login') ? 'text-[#397260] font-medium' : 'text-gray-700'}
    block md:inline-block text-left w-full md:w-auto mt-1 md:mt-0
  `}
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
