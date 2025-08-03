import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

type LogoProps = {
  className?: string;
  showLabel?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
};

export function Logo({ className = '', showLabel = true }: LogoProps) {
  return (
    <Link
      href="/"
      className={clsx(
        'block transition-all duration-300 hover:scale-105',
        className
      )}
    >
      <Image
        src="/tari-logo.png"
        alt="Tari Electra Logo"
        width={70}
        height={70}
        className="object-contain"
        priority={true}
        style={{
          width: '70px',
          height: '70px'
        }}
      />
    </Link>
  );
}
