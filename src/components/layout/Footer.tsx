import Link from 'next/link';
import { Facebook, Mail, Phone } from 'lucide-react'; // Added Mail and Phone

export function Footer() {
  return (
    <footer className="border-t bg-background text-muted-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Tari Electra</h3>
            <p className="text-sm">
              Empowering properties with smart sub-metering solutions.
            </p>
            <p className="text-sm mt-2">
             1st Floor, Coloho Mall, Mavoko, Athi River
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/#products" className="hover:text-primary transition-colors">Products</Link></li>
              <li><Link href="/#about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/#contact" className="hover:text-primary transition-colors">Contact</Link></li> {/* Re-added */}
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-primary" />
                <a href="tel:+254758424283" className="hover:text-primary transition-colors">+254 758 424 283</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-primary" />
                <a href="mailto:hello@tari.africa" className="hover:text-primary transition-colors">hello@tari.africa</a>
              </li>
            </ul>
            <div className="mt-4 flex space-x-3">
              <Link href="https://www.facebook.com/tari.africa" aria-label="Facebook page for Tari Electra" className="text-muted-foreground hover:text-primary" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-6 w-6" />
              </Link>
              {/* Add other social links here */}
            </div>
          </div>
        </div>
        <div className="mt-10 border-t pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Tari Electra. All rights reserved.</p> {/* Corrected to current year */}
          <p className="mt-1">Powered by Tari Africa Platforms Limited</p>
        </div>
      </div>
    </footer>
  );
}
