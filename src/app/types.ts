export interface PlayerProfile {
  '@id': string;
  url: string;
  username: string;
  player_id: number;
  title?: string;
  status: string;
  name?: string;
  avatar?: string;
  location?: string;
  country: string;
  joined: number;
  last_online: number;
  followers: number;
  is_streamer: boolean;
  twitch_url?: string;
  fide?: number;
}

export interface GameStats {
  last?: {
    date: number;
    rating: number;
    rd: number;
  };
  best?: {
    date: number;
    rating: number;
    game: string;
  };
  record: {
    win: number;
    loss: number;
    draw: number;
    time_per_move?: number;
    timeout_percent?: number;
  };
  tournament?: {
    count: number;
    withdraw: number;
    points: number;
    highest_finish: number;
  };
}

export interface PlayerStats {
  chess_daily?: GameStats;
  chess960_daily?: GameStats;
  chess_rapid?: GameStats;
  chess_blitz?: GameStats;
  chess_bullet?: GameStats;
  tactics?: {
    highest: {
      rating: number;
      date: number;
    };
    lowest: {
      rating: number;
      date: number;
    };
  };
  lessons?: {
    highest: {
      rating: number;
      date: number;
    };
    lowest: {
      rating: number;
      date: number;
    };
  };
  puzzle_rush?: {
    best: {
      total_attempts: number;
      score: number;
    };
  };
}

export interface ChessGame {
  url: string;
  pgn: string;
  time_control: string;
  end_time: number;
  rated: boolean;
  fen: string;
  time_class: 'daily' | 'rapid' | 'blitz' | 'bullet';
  rules: string;
  white: {
    rating: number;
    result: string;
    '@id': string;
    username: string;
  };
  black: {
    rating: number;
    result:string;
    '@id': string;
    username: string;
  };
  accuracies?: {
    white: number;
    black: number;
  };
  eco?: string;
  tournament?: string;
  match?: string;
} 