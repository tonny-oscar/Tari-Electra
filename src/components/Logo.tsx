import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

type LogoProps = {
  className?: string;
  showLabel?: boolean;
};

export function Logo({ className = '', showLabel = true }: LogoProps) {
  return (
    <Link
      href="/"
      className={clsx(
        'flex items-center gap-4 group transition-all duration-300',
        className
      )}
    >
      <div className="relative group-hover:scale-105 transition-all duration-300">
        <Image
          src="/tari-logo.png"
          alt="Tari Electra Logo"
          width={120}
          height={120}
          className="object-contain drop-shadow-2xl brightness-110 contrast-110"
          priority={true}
          style={{
            width: '120px',
            height: '120px'
          }}
        />
      </div>
      {showLabel && (
        <span className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
          Tari Electra
        </span>
      )}
    </Link>
  );
}
