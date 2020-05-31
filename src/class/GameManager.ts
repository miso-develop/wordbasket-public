import { Game as Model } from "@/class/Game"
import * as Types from '@/class/types'
import Message from '@/json/message.json'
import { escapeHTML, random, randomPop, zeroPadding, log, clog, sleep, isLocal } from '@/class/util'

export class GameManager {
  private model: Model

  constructor (model: Model) { this.model = model }



  private async getGameId (): Promise<Types.GameId> {
    // log('getGameId!!!!')
    return this.getSearchQuery() || (await this.createNewGameId())
  }

  private getSearchQuery (): Types.GameId {
    return location.search.slice(1)
  }

  private async createNewGameId (): Promise<Types.GameId> {
    // log('createNewGameId!!!!')
    let newGameId = this.generateGameId()
    // Firebase上に既にあれば再帰処理
    return (await this.model.database.existGame(newGameId))
      ? (await this.createNewGameId())
      :newGameId
  }

  private generateGameId (): Types.GameId {
    const GAME_ID_LENGTH = 4
    return zeroPadding(random(9999) + 1, GAME_ID_LENGTH)
  }



  async getGame (): Promise<Types.Game>{
    // log('getGame!!!!')
    // gameId取得
    const gameId = await this.getGameId()
    // game取得、なければ新規作成
    return (await this.model.database.existGame(gameId))
      ? (await this.getGameForFirebase(gameId))
      : (await this.createNewGame(gameId))
  }

  private async getGameForFirebase (gameId: Types.GameId): Promise<Types.Game> {
    // log('getGameForFirebase!!!!')
    const game: Types.Game = await this.model.database.getGame(gameId)
    // player人数チェック
    this.checkPlayersNumber(game)
    return game
  }

  private checkPlayersNumber (game: Types.Game) {
    if (this.canParticipate(game)) return
    // 満員だったら新規ルーム作成
    alert(Message.Error.NO_VACANCY)
    location.href = '/'
  }

  private canParticipate (game: Types.Game): boolean {
    const MAX_PLAYERS = 8
    return Object.keys(game.players).length < MAX_PLAYERS
  }

  private async createNewGame (gameId: Types.GameId): Promise<Types.Game> {
    // log('createNewGame!!!!')
    const game = this.createBlankGame(gameId)
    // Firebaseへ追加
    await this.model.database.addGame(game)
    return game
  }

  private createBlankGame (gameId: Types.GameId): Types.Game {
    return {
      id: gameId,
      count: 0,
      deliberation: false,
      log: {
        player: '',
        action: ''
      },
      createDate: (new Date()).toISOString(),
      lastUpdate: (new Date()).toISOString(),
      basket: [],
      deck: [],
      players: {}
    }
  }

}
