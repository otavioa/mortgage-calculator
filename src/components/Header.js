import React from 'react';
import { CalculatorIcon } from '@heroicons/react/24/outline';

function Header() {
  return (
    <header className="bg-primary-600 text-white">
      <nav className="container mx-auto px-4 h-14">
        <div className="flex items-center justify-between h-full">
          <div>
            <CalculatorIcon className="h-8 w-8 mr-2" />
          </div>
          
          <div className="flex items-center space-x-6">
            <a 
              href="#simulador" 
              className="text-white hover:text-primary-100 transition-colors duration-200"
            >
              Simulador
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header; 