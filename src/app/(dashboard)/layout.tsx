import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SideBar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Joke Vault",
    description: "Joke Vault Dashboard",
};

export const dynamic = 'force-dynamic'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className + " dark ring-0 border-0"}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="group flex flex-row gap-2 lg:gap-3 items-start">
                        <SideBar
                            links={[
                                {
                                    title: "Home",
                                    icon: "home",
                                    href: "/",
                                },
                                {
                                    title: "Users",
                                    icon: "users",
                                    href: "/users",
                                },
                            ]}
                        >
                            {children}
                        </SideBar>
                    </div>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
