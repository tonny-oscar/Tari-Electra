import { Zap } from 'lucide-react';
import Link from 'next/link';

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center space-x-2 text-2xl font-bold ${className}`}>
      <Zap className="h-8 w-8 text-primary" />
      <span className="text-foreground">Tari Smart Power</span>
    </Link>
  );
}
