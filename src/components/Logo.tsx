import Image from 'next/image';
import Link from 'next/link';

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center ${className || ''}`.trim()}>
      <Image
        src="/tari-logo.png"
        alt="Tari Electra Logo"
        width={130} // Aspect ratio preserved (original 195x42)
        height={28}
        priority // Consider logo as LCP element
      />
    </Link>
  );
}
