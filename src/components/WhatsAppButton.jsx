import React from "react";

const WhatsAppButton = () => {
  const phone = "9710552693100"; 

  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 z-50 group md:bottom-6 md:right-6"
      aria-label="Chat on WhatsApp"
    >
      <div className="relative">
        {/* Pulse */}
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></span>

        {/* Button */}
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-[#25D366] shadow-xl hover:scale-110 transition duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="w-8 h-8 fill-white"
          >
            <path d="M16.01 3C8.83 3 3 8.83 3 16c0 2.56.74 5.04 2.14 7.18L3 29l5.97-2.08A12.94 12.94 0 0 0 16.01 29C23.17 29 29 23.17 29 16S23.17 3 16.01 3zm0 23.65c-2.14 0-4.23-.57-6.06-1.65l-.43-.25-3.55 1.24 1.26-3.46-.28-.45A10.6 10.6 0 1 1 16 26.65zm5.86-7.93c-.32-.16-1.88-.93-2.17-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.18.21-.36.24-.68.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.77-2.19-.18-.32-.02-.49.14-.65.15-.15.32-.39.48-.58.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.71-.97-2.35-.26-.62-.53-.54-.71-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.08-1.11 2.63s1.14 3.05 1.3 3.26c.16.21 2.25 3.43 5.45 4.81.76.33 1.36.53 1.82.68.76.24 1.46.21 2.01.13.61-.09 1.88-.77 2.15-1.51.27-.74.27-1.37.19-1.51-.08-.13-.29-.21-.61-.37z" />
          </svg>
        </div>
      </div>
    </a>
  );
};

export default WhatsAppButton;