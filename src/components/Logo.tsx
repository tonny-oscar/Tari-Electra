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
      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary/10 border-2 border-primary shadow-md group-hover:scale-105 transition-transform duration-300">
        <Image
          src="/tari-logo.png"
          alt="Tari Electra Logo"
          fill
          className="object-contain p-1"
          priority
        />
      </div>
      {showLabel && (
        <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
          Tari Electra
        </span>
      )}
    </Link>
  );
}
