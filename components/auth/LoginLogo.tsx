"use client";
import Image from "next/image";

export function LoginLogo() {
  return (
    <div className="flex justify-center">
      <Image
        src="/logo.png"
        alt="Company Logo"
        width={220}
        height={220}
        className="h-auto w-56 select-none"
        draggable={false}
        priority
      />
    </div>
  );
}
