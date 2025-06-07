import { PlayerProfile, PlayerStats } from './types';

export async function getChessComStats(username: string): Promise<{ profile: PlayerProfile; stats: PlayerStats }> {
  const response = await fetch(`/api/chess/${username}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch data');
  }

  const data = await response.json();
  return data;
} 