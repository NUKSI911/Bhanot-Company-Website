import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-2">
      <Image src="/images/logo.svg" alt="404" height={100} width={100} />
      <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-destructive">Could not find the requested page</p>
      <Button asChild variant="outline" className="mt-4 ml-2">
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
