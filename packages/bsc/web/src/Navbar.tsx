// src/Navbar.js
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-slate-400 p-4 w-full shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0">
              <a href="/" className="text-xl font-bold text-gray-800">
                Good Game Points
              </a>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <a href="/" className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </a>
              <a href="/faucet" className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                FAUCET DUMMY ETH
              </a>
              <a href="/stake" className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                MINT STAKESTONE
              </a>
              <a href="/mint" className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                MINT $GGP
              </a>
              <a href="/use" className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                USE $GGP
              </a>
              <ConnectButton />
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/" className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                Home
            </a>
            <a href="/faucet" className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                FAUCET DUMMYETH
            </a>
            <a href="/stake" className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                MINT STAKESTONE
            </a>
            <a href="/mint" className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                MINT $GGP
            </a>
            <a href="/use" className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                USE $GGP
            </a>
            <ConnectButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;