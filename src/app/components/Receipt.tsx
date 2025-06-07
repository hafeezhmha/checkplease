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
    <div className="receipt-container">
      <div className="coffee-stain" />
      <div ref={forwardedRef} className="receipt-content w-full max-w-[88mm] bg-white text-black p-4 sm:p-6 font-mono text-[11px] sm:text-xs leading-relaxed">
        <div className="text-center mb-6">
          <h2 className="text-base sm:text-lg font-bold">CHECKPLEASE!</h2>
          <p>{new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }).toUpperCase()}</p>
          <p className="mt-1 opacity-75">ORDER #{String(Math.floor(Math.random() * 9999)).padStart(4, '0')}</p>
        </div>

        <div className="mb-4 flex items-center">
          {profile.avatar && <img src={profile.avatar} alt="avatar" className="w-12 h-12 rounded-full mr-4" />}
          <div>
            <p>CUSTOMER: {profile.title && `${profile.title} `}{profile.name || profile.username}</p>
            <p className="opacity-75">@{profile.username} ({profile.status})</p>
            {profile.location && <p className="opacity-75">{profile.location}</p>}
          </div>
        </div>

        <div className="border-t border-b border-dashed py-3 mb-4">
          <table className="w-full">
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
          <div className="mb-4">
            <p>W/L/D RECORDS:</p>
            {stats.chess_rapid && <p>RAPID: {stats.chess_rapid.record.win} / {stats.chess_rapid.record.loss} / {stats.chess_rapid.record.draw}</p>}
            {stats.chess_blitz && <p>BLITZ: {stats.chess_blitz.record.win} / {stats.chess_blitz.record.loss} / {stats.chess_blitz.record.draw}</p>}
            {stats.chess_bullet && <p>BULLET: {stats.chess_bullet.record.win} / {stats.chess_bullet.record.loss} / {stats.chess_bullet.record.draw}</p>}
          </div>
        }

        <div className="border-t border-dashed pt-3 mb-4">
            <div className="flex justify-between"><span>JOINED:</span> <span>{new Date(profile.joined * 1000).toLocaleDateString()}</span></div>
            <div className="flex justify-between"><span>FOLLOWERS:</span> <span>{profile.followers}</span></div>
            {lastGame && <div className="flex justify-between"><span>LAST OPENING:</span> <span className="truncate">{lastOpening}</span></div>}
        </div>

        <div className="text-center opacity-75 my-4">
          <p className="italic">"{randomQuote}"</p>
        </div>

        <div className="text-center opacity-75 my-4">
          <p>Served by: {serverName}</p>
          <p>{new Date().toLocaleTimeString()}</p>
        </div>

        <div className="text-center">
          <p className="mb-4">THANK YOU FOR PLAYING!</p>
          <div className="w-full h-auto flex justify-center">
            <QrCode url={profile.url} />
          </div>
          <p className="mt-2 opacity-75">{profile.url.replace('https://www.chess.com/member/', '')}</p>
        </div>
      </div>
      <div className="receipt-fade" />
    </div>
  );
};