import React, { useEffect, useState } from 'react';

const ChatbotButton = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if Voiceflow is loaded
    const checkVoiceflow = setInterval(() => {
      if (window.voiceflow?.chat) {
        setIsLoaded(true);
        clearInterval(checkVoiceflow);
      }
    }, 500);
    
    return () => clearInterval(checkVoiceflow);
  }, []);

  const openChatbot = () => {
    if (window.voiceflow?.chat) {
      // Open the chat widget
      window.voiceflow.chat.open();
    } else {
      console.log('Voiceflow not loaded yet, retrying...');
      // Try to reload
      const script = document.createElement('script');
      script.src = 'https://cdn.voiceflow.com/widget-next/bundle.mjs';
      script.type = 'text/javascript';
      script.onload = () => {
        window.voiceflow.chat.load({
          verify: { projectID: '69c3e8f4825a822552666c1e' },
          url: 'https://general-runtime.voiceflow.com',
          versionID: 'production'
        });
        setTimeout(() => {
          if (window.voiceflow?.chat) {
            window.voiceflow.chat.open();
          }
        }, 1000);
      };
      document.head.appendChild(script);
    }
  };

  return (
    <button
      onClick={openChatbot}
      className="fixed bottom-6 right-6 bg-primary-600 text-white rounded-full p-4 shadow-lg hover:bg-primary-700 transition-all hover:scale-110 z-50 flex items-center justify-center group"
      aria-label="Chat with AI Assistant"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      {!isLoaded && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
      )}
    </button>
  );
};

export default ChatbotButton;
