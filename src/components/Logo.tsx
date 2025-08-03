import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  showLabel?: boolean;
}

export function Logo({ showLabel = false }: LogoProps) {
  return (
    <Link 
      href="/" 
      title="Go to Homepage"
      className="block transition-all duration-300 hover:scale-105 cursor-pointer"
    >
      <Image
        src="/LOGO_1.png"
        alt="Tari Electra Logo"
        width={100}
        height={100}
        className="object-contain"
      />
    </Link>
  );
}
