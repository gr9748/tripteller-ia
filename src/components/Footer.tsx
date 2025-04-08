
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { Shield, HelpCircle } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto py-8 px-4">
      <div className="container mx-auto">
        <Separator className="mb-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              TravelAI
            </h3>
            <p className="text-muted-foreground text-sm">
              Your AI-powered travel companion for discovering and planning unforgettable trips worldwide.
            </p>
          </div>
          
          <div>
            <h3 className="text-md font-semibold mb-3">Security & Privacy</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <span>256-bit encryption for all data</span>
              </li>
              <li className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <span>No third-party data sharing</span>
              </li>
              <li className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <span>GDPR compliant services</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-md font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {currentYear} TravelAI. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-foreground transition-colors">
              <HelpCircle className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
