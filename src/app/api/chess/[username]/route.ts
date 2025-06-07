import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  try {
    const userAgent = 'check-please/0.1.0 (https://github.com/hafeezhmha/checkplease)';

    const [profileResponse, statsResponse] = await Promise.all([
      fetch(`https://api.chess.com/pub/player/${username}`, {
        headers: { 'User-Agent': userAgent },
      }),
      fetch(`https://api.chess.com/pub/player/${username}/stats`, {
        headers: { 'User-Agent': userAgent },
      }),
    ]);

    if (profileResponse.status === 404 || statsResponse.status === 404) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!profileResponse.ok || !statsResponse.ok) {
      console.error('Failed to fetch from Chess.com API:', { 
        profileStatus: profileResponse.status, 
        statsStatus: statsResponse.status 
      });
      return NextResponse.json({ error: 'Failed to fetch Chess.com data' }, { status: 500 });
    }

    const profile = await profileResponse.json();
    const statsData = await statsResponse.json();

    const chessStats = {
      chess_rapid: statsData?.chess_rapid,
      chess_blitz: statsData?.chess_blitz,
      chess_bullet: statsData?.chess_bullet,
      tactics: statsData?.tactics,
      puzzle_rush: statsData?.puzzle_rush,
    };

    try {
      const archivesResponse = await fetch(`https://api.chess.com/pub/player/${username}/games/archives`, {
        headers: { 'User-Agent': userAgent },
      });

      if (archivesResponse.ok) {
        const archives = await archivesResponse.json();
        if (archives.archives.length > 0) {
          const latestGamesUrl = archives.archives[archives.archives.length - 1];
          const gamesResponse = await fetch(latestGamesUrl, {
            headers: { 'User-Agent': userAgent },
          });

          if (gamesResponse.ok) {
            const games = await gamesResponse.json();
            if (games.games.length > 0) {
              const lastGame = games.games[games.games.length - 1];
              return NextResponse.json({ profile, stats: chessStats, lastGame });
            }
          }
        }
      }
    } catch (archiveError) {
      console.error("Could not fetch game archives, proceeding without them:", archiveError);
    }

    return NextResponse.json({ profile, stats: chessStats });
  } catch (error) {
    console.error('Error in chess API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 