import ChatWidget from "@/components/ChatWidget";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import React from "react";
import ThemeProvider from "../theme-provider";

const layoutPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <ThemeProvider>
        <div>
          <header className="sticky top-0 z-50">
            <Navbar></Navbar>
          </header>
          <main>{children}</main>
          <ChatWidget />
          <Footer></Footer>
        </div>
      </ThemeProvider>
    </div>
  );
};

export default layoutPage;
