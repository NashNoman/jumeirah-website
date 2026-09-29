import { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="flex h-full items-center justify-center">
      404 - Page Not Found
    </div>
  );
}
