import Image from "next/image";
import Link from "next/link";

export function TopBarLogo() {
  return (
    <Link
      href="/dashboard/targets"
      className="flex items-center gap-2 group select-none"
    >
      <div className="flex justify-center">
        <Image
          src="/widelogo.png"
          alt="Company Logo"
          width={120}
          height={120}
          className="select-none"
          draggable={true}
          priority
        />
      </div>
    </Link>
  );
}
