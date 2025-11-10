import { Stethoscope } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">MedTech</span>
          </div>
          <p className="text-gray-600 text-sm">
            © 2024 MedTech. All rights reserved. Your trusted medical assistant.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

