import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

export const Footer: FC = () => (
  <footer className="absolute bottom-1 z-10">
    <Link href="/" passHref>
      <button className="btn btn-link">
        <Image
          src="/android-chrome-192x192.png"
          height={30}
          width={30}
          alt="RightClickable"
        />
      </button>
    </Link>
  </footer>
);
