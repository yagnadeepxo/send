'use client';
import './styles.css';

import { useState } from 'react';

export default function Home() {
  const [actionUrl, setActionUrl] = useState<string>('');

  const generateActionUrl = () => {
    // Replace with your actual deployed action URL
    const baseUrl = 'https://jup.ag/swap/USDC-SEND';
    setActionUrl(baseUrl);
  };

  return (
    <div className="container">
      <main className="main">
        <h1 className="title">
          Support Your Favorite Content Creators
        </h1>
        
        <p className="description">
          Show appreciation for great content by tipping creators with SEND tokens!
        </p>

        <button 
          onClick={generateActionUrl}
          className="button"
        >
          Tip the creator
        </button>

        {actionUrl && (
          <div className="link-container">
            <a 
              href={actionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              Buy SEND
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
