'use client';
// import './styles.css';

// import { useState } from 'react';

// export default function Home() {
//   const [actionUrl, setActionUrl] = useState<string>('');

//   const generateActionUrl = () => {
//     // Replace with your actual deployed action URL
//     const baseUrl = 'https://jup.ag/swap/USDC-SEND';
//     setActionUrl(baseUrl);
//   };

//   return (
//     <div className="container">
//       <main className="main">
//         <h1 className="title">
//           Support Your Favorite Content Creators
//         </h1>
        
//         <p className="description">
//           Show appreciation for great content by tipping creators with SEND tokens!
//         </p>

//         <button 
//           onClick={generateActionUrl}
//           className="button"
//         >
//           Tip the creator
//         </button>

//         {actionUrl && (
//           <div className="link-container">
//             <a 
//               href={actionUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="link"
//             >
//               Buy SEND
//             </a>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }



import React, { useState } from 'react';

export default function GenerateUrl() {
  const [publicKey, setPublicKey] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicKey }),
      });
      const data = await response.json();
      setGeneratedUrl(data.url);
    } catch (error) {
      console.error('Error generating URL:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Generate Your Donation URL</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={publicKey}
          onChange={(e) => setPublicKey(e.target.value)}
          placeholder="Enter your public key"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Generate URL</button>
      </form>
      {generatedUrl && (
        <div style={styles.resultContainer}>
          <p style={styles.resultText}>Your custom donation URL:</p>
          <a href={generatedUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
            {generatedUrl}
          </a>
        </div>
      )}
      <a href="https://jup.ag/swap/USDC-SEND" target="_blank" rel="noopener noreferrer" style={styles.buyButton}>
        Buy SEND Tokens
      </a>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: 'white',
    padding: '20px',
  },
  heading: {
    color: '#1e40af',
    marginBottom: '30px',
    textAlign: 'center' as 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '400px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #1e40af',
    fontSize: '16px',
  },
  button: {
    backgroundColor: '#1e40af',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  resultContainer: {
    marginTop: '30px',
    textAlign: 'center' as 'center',
  },
  resultText: {
    color: '#1e40af',
    marginBottom: '10px',
  },
  link: {
    color: '#1e40af',
    wordBreak: 'break-all' as 'break-all',
  },
  buyButton: {
    marginTop: '30px',
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
};