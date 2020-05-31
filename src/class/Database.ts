import { initializeApp, database} from 'firebase'
import _ from 'lodash'
import { Game as Model } from "@/class/Game"
import * as Types from '@/class/types'
import { escapeHTML, random, randomPop, zeroPadding, log, clog, sleep, isLocal } from '@/class/util'

const config = {
  apiKey: 'AIzaSyAqX46v5isgpLdA-kwERWQf4ZDqVNsW-_o',
  databaseURL: 'https://wordbasket-domi.firebaseio.com'
}

export class Database {
  private database: database.Database;
  private gamesRef: database.Reference;
  private gameRef: database.Reference = {} as database.Reference;

  private model: Model

  constructor (model: Model) {
    // log("Database.constructor!!!!")
    this.model = model

    initializeApp(config)
    this.database = database()
    this.gamesRef = this.database.ref('/games')
    this.deleteOldGame()
  }

  // 1時間以上更新のないGameを削除
  private deleteOldGame () {
    // log("Database.deleteOldGame!!!!")
    this.gamesRef.once('value', snapshot => {
      Object.entries(snapshot.val() as Types.Games)
        .filter(([, game]) => this.isOldGame(game.lastUpdate))
        .forEach(([key]) => this.gamesRef.child(key as string).remove())
    })
  }

  private isOldGame(gameDate: Types.ISOString): boolean {
    const oneHour = 1000 * 60 * 60
    const limitTime = oneHour
    const lastUpdate = new Date(gameDate)
    const now = new Date()
    const dateDiffMSec = now.getTime() - lastUpdate.getTime()
    const dateDiffHour = dateDiffMSec / limitTime
    return dateDiffHour >= 1
  }

  setOn (syncData: Function) {
    // log("Database.setOn!!!!")
    this.gameRef.on('value', async (snapshot: database.DataSnapshot) => {
      // log("Database.on!!!!")
      const game: Types.Game = this.recoverGame(snapshot.val())
      await syncData(game)
    })
  }

  async existGame(gameId: Types.GameId): Promise<boolean> {
    // log("Database.existGame!!!!")
    const gameValues = Object.values(await this.getGames())
    const filteredGames = gameValues.filter(game => { return game.id === gameId })
    return !!filteredGames.length
  }

  async getGames (): Promise<Types.Games> {
    // log("Database.getGames!!!!")
    const snapshot = await this.gamesRef.once('value')
    return snapshot.val()
  }

  async getGame(gameId: Types.GameId): Promise<Types.Game> {
    // log("Database.getGame!!!!")

    // game取得
    const gameEntries = Object.entries(await this.getGames())
    const [key, game] = gameEntries.filter(([, game]) => { return game.id === gameId})[0]

    // gameRefを保持
    this.gameRef = this.database.ref(`/games/${key}`)

    // 空オブジェクト・配列を補完して返却（Firebaseに入れるとき空オブジェクト・配列が消えるっぽい）
    return this.recoverGame(game)
  }

  // 空配列補完（Firebaseに入れるとき空配列消えるっぽい）
  private recoverGame(game: Types.Game): Types.Game {
    // log("Database.recoverGame!!!!")
    if (!game.basket) game.basket = []
    if (!game.deck) game.deck = []
    if (!game.players) game.players = {}

    const playerValues = Object.values(game.players)
    playerValues.forEach(player => { if (!player.hand) player.hand = [] })

    return game
  }

  async addGame (game: Types.Game) {
    // log("Database.addGame!!!!")
    // pushでgame追加、合わせて振られたkeyを取得
    const key = await this.gamesRef.push(game).key
    // gameRefを保持
    this.gameRef = this.database.ref(`/games/${key}`)
  }

  async updateGame () {
    // log("Database.updateGame!!!!")
    // lastUpdate更新
    this.model.game.lastUpdate = (new Date()).toISOString()
    // update
    this.gameRef.key && await this.gameRef.update(this.model.game)
  }

  async existPlayerKey(gameId: Types.GameId, playerKey: string): Promise<boolean> {
    // log('Database.existPlayerKey!!!!')
    // game取得
    const game = Object.values(await this.getGames()).filter(game => game.id === gameId)[0]
    // gameかplayersがなければfalse
    if (!game || !game.players) return false
    // 重複チェック結果を返し
    return Object.keys(game.players).filter(key => key === playerKey).length > 0
  }



  // DEBUG:
  async reset() {
    // log("Database.reset!!!!")
    await this.gamesRef.set([{id:0}])
  }

}
