import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/Chatwindow";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile = closed

  return (
    <div className="flex h-screen w-full relative bg-white">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
  

      {/* Main area */}
      <div className="flex-1 flex flex-col w-full ">
        {/* Chat Window */}
        <ChatWindow setSidebarOpen={setSidebarOpen} />
      </div>
    </div>
  );
};

export default App;
