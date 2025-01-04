import { APP_NAME } from "@/lib/constant";
import Image from "next/image";
import Link from "next/link";
import Menu from "./menu";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className=" flex-start">
          <Link href="/" className=" flex-start">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} logo`}
              height={24}
              width={24}
              priority={true}
            />
            <span className="font-bold ml-3 text-2xl hidden lg:block">
              {APP_NAME}
            </span>
          </Link>
        </div>

        <Menu />
      </div>
    </header>
  );
};

export default Header;