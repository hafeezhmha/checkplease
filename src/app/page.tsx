'use client'
import { useState, useRef } from 'react'
import { Press_Start_2P } from 'next/font/google'
import { getChessComStats } from './services';
import { PlayerProfile, PlayerStats, ChessGame } from './types';
import { toPng } from 'html-to-image';
import { Receipt } from './components/Receipt';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
});

interface CheckPleaseData {
  profile: PlayerProfile;
  stats: PlayerStats;
  lastGame?: ChessGame;
}

export default function Home() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState<CheckPleaseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (receiptRef.current) {
      const dataUrl = await toPng(receiptRef.current, { quality: 0.95 });
      const link = document.createElement('a');
      link.download = `checkplease-receipt-${data?.profile?.username || 'user'}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  const handleShare = async () => {
    if (!receiptRef.current) return;

    try {
      const dataUrl = await toPng(receiptRef.current);
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `checkplease-receipt-${data?.profile?.username || 'user'}.png`, { type: 'image/png' });

      if (navigator.share) {
        await navigator.share({
          title: 'My Chess.com Receipt',
          text: `Check out my Chess.com stats for ${data?.profile?.username}!`,
          files: [file]
        });
      } else {
        handleDownload();
      }
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Sharing failed, downloading instead.');
      handleDownload();
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('handleSubmit triggered.');
    if (!username) {
      console.log('No username entered.');
      return;
    }
    
    setLoading(true);
    setError('');
    setData(null);
    console.log('State reset, starting fetch for:', username);
    
    try {
      const chessData = await getChessComStats(username);
      console.log('Data fetched successfully:', chessData);
      setData(chessData);
    } catch (err: any) {
      console.error('An error occurred during fetch:', err);
      setError(err.message || 'An error occurred while fetching user data.');
    } finally {
      console.log('Fetch attempt finished.');
      setLoading(false);
    }
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className={`${pressStart2P.className} text-3xl sm:text-5xl font-bold mb-4 text-white`}>
          CheckPlease!
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-lg mx-auto">
          Generate a receipt of your Chess.com stats and recent activity.
        </p>
        <div className="mt-6 text-sm text-zinc-400 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <a 
            href="https://x.com/hafeezhmha" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-purple-400 transition-colors duration-200 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.232 4.232C12.586 4.232 12.932 4.318 13.254 4.478C13.576 4.638 13.864 4.878 14.096 5.182C14.328 5.486 14.498 5.846 14.594 6.242C14.69 6.638 14.71 7.054 14.654 7.462L13.2 16.742C13.116 17.311 12.753 17.818 12.232 18.118C11.712 18.418 11.088 18.478 10.532 18.282L4.232 16.232" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14.232L17.232 6" />
            </svg>
            made by hafeez
          </a>
          <span className="opacity-50">|</span>
          <a 
            href="https://buymeacoffee.com/hafeezhmha8" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-purple-400 transition-colors duration-200 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11a1 1 0 112 0 1 1 0 01-2 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            buy hafeez a coffee
          </a>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-16">
        <div className="flex gap-3 max-w-md mx-auto">
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (e.target.value === '') {
                setData(null);
                setError('');
              }
            }}
            placeholder="Enter Chess.com username"
            autoCapitalize="none"
            autoComplete="off"
            className="flex-1 px-5 py-2.5 rounded-lg bg-zinc-800 
                     border-2 border-zinc-600 focus:border-purple-500
                     text-white
                     focus:outline-none focus:ring-0 focus:ring-2 focus:ring-purple-500 shadow-inner
                     font-mono text-[17px] placeholder-zinc-500"
          />
          <button
            type="submit"
            disabled={!username || loading}
            className="px-6 sm:px-8 py-2.5 rounded-lg bg-purple-600 text-white font-bold
                     hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-200 active:scale-[0.98] active:transition-transform border-2 border-purple-600 shadow-xl"
          >
            Generate
          </button>
        </div>
      </form>

      {loading && (
        <div className="flex flex-col items-center justify-center my-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500" />
          <p className="mt-4 text-zinc-400">Loading...</p>
        </div>
      )}

      {error && (
        <div className="flex justify-center text-red-400 my-8">
          <p className="p-4 bg-red-900/50 rounded-lg shadow-inner text-center max-w-sm">{error}</p>
        </div>
      )}
      
      {data && (
        <div className="flex flex-col items-center">
          <Receipt 
            key={username}
            profile={data.profile} 
            stats={data.stats} 
            lastGame={data.lastGame} 
            forwardedRef={receiptRef} 
          />
          
          <div className="mt-8 flex gap-4">
            <button
              onClick={handleDownload}
              className="px-5 py-2.5 bg-zinc-800 rounded-lg
                       text-white
                       hover:bg-zinc-700
                       transition-colors duration-200 active:scale-[0.98] active:transition-transform flex items-center gap-2 text-base border-2 border-zinc-600 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
            <button
              onClick={handleShare}
              className="px-5 py-2.5 bg-zinc-800 rounded-lg
                       text-white
                       hover:bg-zinc-700
                       transition-colors duration-200 active:scale-[0.98] active:transition-transform flex items-center gap-2 text-base border-2 border-zinc-600 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
          </div>
        </div>
      )}

    </>
  );
} 