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
        'block transition-all duration-300 hover:scale-105 cursor-pointer',
        className
      )}
      title="Go to Homepage"
    >
      <Image
        src="/LOGO_1.png"
        alt="Tari Electra Logo - Click to go home"
        width={100}
        height={100}
        className="object-contain cursor-pointer"
        priority={true}
        style={{
          width: '100px',
          height: '100px'
        }}
      />
    </Link>
  );
}
