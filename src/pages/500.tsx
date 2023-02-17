// pages/500.js
import Link from "next/link";

export default function Custom500() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-screen">
      <h1 className="text-3xl">500 - Server Error</h1>
      <Link href={"/"}>
        <a className={"btn btn-link"}>Return to home</a>
      </Link>
    </div>
  );
}
