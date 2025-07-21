import React from 'react';
import BookingForm from './components/BookingForm';
import ChatWidget from './components/ChatWidget';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Vexere - Đặt vé xe trực tuyến</h1>
      </header>
      <main>
        <BookingForm />
      </main>
      <ChatWidget />
      <footer>
        <p>© 2025 Vexere Clone</p>
      </footer>
    </div>
  );
}

export default App;