import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import React from "react";

const layoutPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div>
        <header className="sticky top-0 z-50">
          <Navbar></Navbar>
        </header>
        <main>{children}</main>
        <Footer></Footer>
      </div>
    </div>
  );
};

export default layoutPage;
