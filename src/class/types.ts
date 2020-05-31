// TODO:
export type GameId = string
// TODO:
export type PlayerId = number
// TODO:
export type ISOString = string



export type Card =
  "あ" | "い" | "う" | "え" | "お" |
  "か" | "き" | "く" | "け" | "こ" |
  "さ" | "し" | "す" | "せ" | "そ" |
  "た" | "ち" | "つ" | "て" | "と" |
  "な" | "に" | "ぬ" | "ね" | "の" |
  "は" | "ひ" | "ふ" | "へ" | "ほ" |
  "ま" | "み" | "む" | "め" | "も" |
  "や" | "ゆ" | "よ" |
  "ら" | "り" | "る" | "れ" | "ろ" |
  "わ" |
  "W5" | "W6" | "W7+" |
  "あ行" | "か行" | "さ行" | "た行" | "な行" | "は行" | "ま行" | "や行" | "ら行"

export type History = {
  card: Card;
  hadPlayerId: PlayerId
}

export type Hand = Card[];

export type Player = {
  id: PlayerId;
  name: string;
  master: boolean;
  winCount: number;
  hand: Hand;
}

export type Deck =  Card[];

export type Basket = History[];

export type Log = {
  player: string;
  action: string;
  card?: string;
}

export type PlayerKey = {
  [key: string]: Player
}

export type Game = {
  id: GameId;
  count: number;
  deliberation: boolean;
  log: Log;
  createDate: ISOString;
  lastUpdate: ISOString;
  basket: Basket;
  deck: Deck;
  players: PlayerKey;
}

export type GameKey = {
  [key: string]: Game
}

export type Games = GameKey;
