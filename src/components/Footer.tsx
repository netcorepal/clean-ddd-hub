
import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-ddd-600 to-ddd-800 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">DDD</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Clean DDD</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Promoting software design principles that balance technical excellence with business value.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/knowledge" className="text-gray-600 hover:text-ddd-600 transition-all-200">
                  Knowledge Base
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-600 hover:text-ddd-600 transition-all-200">
                  Events
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-ddd-600 transition-all-200">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-ddd-600 transition-all-200">
                  Case Studies
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Community
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-ddd-600 transition-all-200">
                  Join Slack
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-ddd-600 transition-all-200">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-ddd-600 transition-all-200">
                  Forum
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-ddd-600 transition-all-200">
                  Code of Conduct
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Connect
            </h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-ddd-600 transition-all-200">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-ddd-600 transition-all-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-ddd-600 transition-all-200">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Subscribe to our newsletter</h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="min-w-0 flex-1 rounded-l-md border border-gray-300 bg-white py-2 px-3 text-gray-900 placeholder-gray-500 focus:border-ddd-500 focus:ring-ddd-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-r-md border border-transparent bg-ddd-600 py-2 px-4 text-sm font-medium text-white hover:bg-ddd-700 focus:outline-none"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Clean DDD. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-500 hover:text-ddd-600 transition-all-200">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-ddd-600 transition-all-200">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
