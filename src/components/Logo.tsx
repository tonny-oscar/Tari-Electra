import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  showLabel?: boolean;
}

export function Logo({ showLabel = false }: LogoProps) {
  return (
    <Link 
      href="/" 
      title="Tari Electra - Go to Homepage"
      className="flex items-center gap-3 transition-all duration-300 hover:scale-105"
    >
      <Image
        src="/LOGO_1.png"
        alt="Tari Electra Logo"
        width={120}
        height={120}
        className="object-contain rounded-lg shadow-sm"
        priority
      />
      {showLabel && (
        <div className="flex flex-col">
          <span className="text-xl font-bold text-primary">Tari Electra</span>
          <span className="text-sm text-muted-foreground">Electrical Solutions</span>
        </div>
      )}
    </Link>
  );
}
