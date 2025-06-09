import React from 'react';
import { PlayerProfile, PlayerStats, ChessGame } from '../types';
import { QrCode } from './QrCode';

const GRANDMASTERS = [
  "Magnus Carlsen",
  "Garry Kasparov",
  "Fabiano Caruana",
  "Hikaru Nakamura",
  "Bobby Fischer",
  "Anatoly Karpov",
  "Vladimir Kramnik",
  "Viswanathan Anand",
  "Mikhail Tal",
  "Judit Polgar"
];

interface ReceiptProps {
  profile: PlayerProfile;
  stats: PlayerStats;
  lastGame?: ChessGame;
  forwardedRef: React.RefObject<HTMLDivElement>;
}

const StatRow: React.FC<{label: string, value: any, best?: number, url?: string}> = ({ label, value, best, url }) => (
  <tr>
    <td>{label}</td>
    <td className="text-right">
      {value} {best && <span className="text-zinc-500">({best})</span>}
      {url && <a href={url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500">[Link]</a>}
    </td>
  </tr>
);

export const Receipt: React.FC<ReceiptProps> = ({ profile, stats, lastGame, forwardedRef }) => {
  const serverName = GRANDMASTERS[Math.floor(Math.random() * GRANDMASTERS.length)];
  const lastOpening = lastGame?.eco?.split(': ')[1] || 'N/A';
  const gothamQuotes = [
    "And he sacrifices... THE ROOK!",
    "He's playing the London System. Of course.",
    "This is not a checkmate.",
    "Absolutely beautiful.",
    "Oh no, my queen!",
    "The greatest of all time!",
    "Let's go, let's go!",
    "It's a brilliancy!",
    "What a move!",
  ];
  const randomQuote = gothamQuotes[Math.floor(Math.random() * gothamQuotes.length)];

  return (
    <div className="receipt-container relative mx-auto my-8">
      <div className="coffee-stain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div ref={forwardedRef} className="receipt-content w-full max-w-[88mm] bg-white text-black p-5 sm:p-7 font-mono text-[12px] sm:text-sm leading-relaxed border border-gray-200 rounded-lg shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-2 text-gray-900">CHECKPLEASE!</h2>
          <p className="text-xs sm:text-sm text-gray-700">{new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }).toUpperCase()}</p>
          <p className="mt-2 text-xs opacity-75 text-gray-600">ORDER #{String(Math.floor(Math.random() * 9999)).padStart(4, '0')}</p>
        </div>

        <div className="mb-6 flex items-center bg-gray-50 p-3 rounded-md shadow-sm">
          {profile.avatar && <img src={profile.avatar} alt="avatar" className="w-14 h-14 rounded-full mr-4 border-2 border-gray-300 shadow" />}
          <div>
            <p className="font-bold text-gray-800 text-sm">CUSTOMER: {profile.title && `${profile.title} `}{profile.name || profile.username}</p>
            <p className="opacity-85 text-gray-700 text-xs">@{profile.username} ({profile.status})</p>
            {profile.location && <p className="opacity-85 text-gray-700 text-xs">{profile.location}</p>}
          </div>
        </div>

        <div className="border-t border-b border-dashed border-gray-300 py-4 mb-6">
          <table className="w-full text-sm">
            <tbody>
              {stats.chess_rapid && <StatRow label="RAPID" value={stats.chess_rapid.last?.rating} best={stats.chess_rapid.best?.rating} url={stats.chess_rapid.best?.game} />}
              {stats.chess_blitz && <StatRow label="BLITZ" value={stats.chess_blitz.last?.rating} best={stats.chess_blitz.best?.rating} url={stats.chess_blitz.best?.game} />}
              {stats.chess_bullet && <StatRow label="BULLET" value={stats.chess_bullet.last?.rating} best={stats.chess_bullet.best?.rating} url={stats.chess_bullet.best?.game} />}
              {stats.tactics && <StatRow label="PUZZLES" value={stats.tactics.highest?.rating} />}
              {stats.puzzle_rush?.best && <StatRow label="PUZZLE RUSH" value={stats.puzzle_rush.best.score} />}
            </tbody>
          </table>
        </div>

        {(stats.chess_rapid || stats.chess_blitz || stats.chess_bullet) &&
          <div className="mb-6 p-3 bg-gray-50 rounded-md shadow-sm">
            <p className="font-bold text-gray-800 text-sm mb-2">W/L/D RECORDS:</p>
            {stats.chess_rapid && <p className="text-xs text-gray-700">RAPID: {stats.chess_rapid.record.win} / {stats.chess_rapid.record.loss} / {stats.chess_rapid.record.draw}</p>}
            {stats.chess_blitz && <p className="text-xs text-gray-700">BLITZ: {stats.chess_blitz.record.win} / {stats.chess_blitz.record.loss} / {stats.chess_blitz.record.draw}</p>}
            {stats.chess_bullet && <p className="text-xs text-gray-700">BULLET: {stats.chess_bullet.record.win} / {stats.chess_bullet.record.loss} / {stats.chess_bullet.record.draw}</p>}
          </div>
        }

        <div className="border-t border-dashed border-gray-300 pt-4 mb-6 text-sm text-gray-700">
            <div className="flex justify-between mb-1"><span>JOINED:</span> <span>{new Date(profile.joined * 1000).toLocaleDateString()}</span></div>
            <div className="flex justify-between mb-1"><span>FOLLOWERS:</span> <span>{profile.followers}</span></div>
            {lastGame && <div className="flex justify-between"><span>LAST OPENING:</span> <span className="truncate max-w-[60%] text-right">{lastOpening}</span></div>}
        </div>

        <div className="text-center opacity-85 my-6 text-gray-800">
          <p className="italic text-sm">"{randomQuote}"</p>
        </div>

        <div className="text-center opacity-75 my-6 text-gray-600 text-xs">
          <p>Served by: {serverName}</p>
          <p>{new Date().toLocaleTimeString()}</p>
        </div>

        <div className="text-center pt-4 border-t border-dashed border-gray-300">
          <p className="mb-4 text-sm font-bold text-gray-900">THANK YOU FOR PLAYING!</p>
          <div className="w-full h-auto flex justify-center mb-2">
            <QrCode url={profile.url} />
          </div>
          <p className="mt-2 opacity-75 text-gray-600 text-xs">{profile.url.replace('https://www.chess.com/member/', '')}</p>
        </div>
      </div>
      <div className="receipt-fade absolute inset-0" />
    </div>
  );
};