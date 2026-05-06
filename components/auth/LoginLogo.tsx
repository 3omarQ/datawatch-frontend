"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function LoginLogo() {
  const pathname = usePathname();
  const isRegister = typeof pathname === "string" && pathname.includes("sign-up");

  // Make the logo slightly smaller on the register page to save vertical space.
  const dims = isRegister ? { width: 180, height: 180, className: "h-auto w-44" } : { width: 220, height: 220, className: "h-auto w-56" };

  return (
    <div className="flex justify-center">
      <Image
        src="/logo.png"
        alt="Company Logo"
        width={dims.width}
        height={dims.height}
        className={`${dims.className} select-none`}
        draggable={false}
        priority
      />
    </div>
  );
}
