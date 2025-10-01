"use client";

import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2 sm:gap-3 transition-all duration-300 hover:scale-105"
      suppressHydrationWarning
    >
      <Image
        src="/LOGO_1.png"
        alt="Tari Electra Logo"
        width={120}         // ⬆️ increased base size
        height={120}        // ⬆️ increased base size
        className="
          w-20 h-20          /* default size ~80px */
          sm:w-24 sm:h-24    /* larger on small screens and above */
          lg:w-28 lg:h-28    /* optional: even larger on large screens */
          object-contain
          transition-all duration-300 group-hover:scale-110
          dark:invert
          dark:brightness-90
        "
        suppressHydrationWarning
      />
    </Link>
  );
}
