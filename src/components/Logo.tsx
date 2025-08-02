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
        'flex items-center gap-3 group transition-all duration-300',
        className
      )}
    >
      <div className="relative group-hover:scale-110 transition-all duration-300">
        <Image
          src="/tari-logo.png"
          alt="Tari Electra Logo"
          width={80}
          height={80}
          className="object-contain drop-shadow-xl"
          priority={true}
          style={{
            width: '80px',
            height: '80px'
          }}
        />
      </div>
      {showLabel && (
        <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
          
        </span>
      )}
    </Link>
  );
}
