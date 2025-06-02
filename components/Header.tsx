import Image from "next/image";
import logoIcon from "@/public/logo.svg";
import Link from "next/link";

const Header = ({ children }: HeaderProps) => {
  return (
    <div className="border-b border-white/20 py-4 text-white">
      <div className="container flex justify-between items-center">
        <div>
          <Link href="/" className="flex items-center">
            <Image src={logoIcon} alt="logo" width={24} height={24} />
            <span className="mt-1 font-medium">CollabWrite</span>
          </Link>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Header;
