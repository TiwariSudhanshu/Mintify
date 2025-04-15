import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BackButton() {
  return (
    <Link href="/" className="inline-flex items-center text-gray-300 hover:text-white transition-colors">
      <ArrowLeft className="h-5 w-5 mr-2" />
      Back to Home
    </Link>
  );
} 