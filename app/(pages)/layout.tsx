// import "@/app/css/website-only.css";

import WebsiteNavbar from "@/components/custom/WebsiteNavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full">
      <WebsiteNavbar />
      {/* <Link
        href={whatsappUrl}
        target="_blank"
        className="overflow-hidden duration-100 fixed bottom-6 right-4 md:right-8 lg:right-12 grid place-items-center aspect-square rounded-full h-20 w-20 z-[2]"
      >
        <Image
          src="/svgs/whatsapp.svg"
          alt="Chat on Whatsapp"
          width={100}
          height={100}
        />
      </Link> */}
      {children}
    </main>
  );
}
