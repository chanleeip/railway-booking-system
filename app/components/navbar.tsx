// components/Navbar.js
import Link from 'next/link';

interface NavbarProps {
  username: string;
}
const Navbar:React.FC<NavbarProps> = ({username}) => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-xl">
            Railway Ticket Booking
        </Link>
        <div className="space-x-4">
          <Link href="/about" className="text-gray-300 hover:text-white">
            About
          </Link>
          <Link href="/contact" className="text-gray-300 hover:text-white">
            Contact
          </Link>
          <Link href="/profile" className="text-gray-300 hover:text-white">
            {username}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;