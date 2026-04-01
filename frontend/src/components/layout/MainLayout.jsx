import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatbotButton from '../common/ChatbotButton';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <ChatbotButton />
    </div>
  );
};

export default MainLayout;
