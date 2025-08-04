// components/Logo.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" title="Go to Homepage" className="block transition-all duration-300 hover:scale-105 cursor-pointer">
      <Image
        src="/LOGO_1.png"
        alt="Tari Electra Logo"
        width={120}
        height={120}
        className="object-contain"
        priority
      />
    </Link>
  );
}
