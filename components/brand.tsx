import Image from "next/image";
import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" aria-label="PANDA Creator home" className="inline-flex shrink-0 items-center">
      <Image
        src="/brand-logo.png"
        alt="PANDA"
        width={710}
        height={320}
        priority
        sizes="110px"
        className="h-11 w-auto"
      />
      <span className="sr-only">Creator</span>
    </Link>
  );
}
