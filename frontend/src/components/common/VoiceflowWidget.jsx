import React, { useState } from 'react';
import { HiX } from 'react-icons/hi';

const VoiceflowWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleWidget}
        className="fixed bottom-6 right-6 bg-primary-600 text-white rounded-full p-4 shadow-lg hover:bg-primary-700 transition-all hover:scale-110 z-50 flex items-center justify-center group"
        aria-label="Chat with AI Assistant"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Chat Widget Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md h-[600px] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b bg-primary-600 text-white">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <h3 className="font-semibold">CivicLens Assistant</h3>
              </div>
              <button onClick={toggleWidget} className="text-white hover:text-gray-200">
                <HiX className="w-5 h-5" />
              </button>
            </div>
            <iframe
              src="https://creator.voiceflow.com/share/69c3e8f4825a822552666c1e/production"
              title="CivicLens AI Assistant"
              className="flex-1 w-full border-0"
              allow="microphone"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceflowWidget;
