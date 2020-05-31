import { Game as Model } from "@/class/Game"
import * as Types from '@/class/types'
import { escapeHTML, random, randomPop, zeroPadding, log, clog, sleep, isLocal } from '@/class/util'

export class PlayerManager {
  private model: Model

  constructor (model: Model) { this.model = model }

  async addPlayer (): Promise<Types.Player> {
    // log('addPlayer!!!!')
    // playerId生成
    const playerId = this.createPlayerId(this.model.game)
    // player生成
    const player = playerId === 1 ? this.createMaster() : this.createPlayer(playerId)
    // player key生成
    const playerKey = await this.generatePlayerKey(this.model.game.id)
    // player追加
    this.model.game.players[playerKey] = player
    // player参照取得
    return player
  }

  private createPlayerId (game: Types.Game): Types.PlayerId {
    return Object.keys(game.players).length + 1
  }

  private createMaster (): Types.Player {
    // log('createMaster!!!!')
    const player = this.createPlayer(1)
    player.master = true
    return player
  }

  private createPlayer (id: Types.PlayerId): Types.Player {
    // log('createPlayer!!!!')
    return {
      id,
      hand: [],
      master: false,
      name: `Player${id}`,
      winCount: 0
    }
  }

  private async generatePlayerKey (gameId: Types.GameId): Promise<string> {
    // log('generatePlayerKey!!!!')
    const PLAYER_KER_LENGTH = 8
    const playerKey = zeroPadding(random(10 ** PLAYER_KER_LENGTH), PLAYER_KER_LENGTH)
    // playerKey重複してたら再帰処理で再生成
    return (await this.model.database.existPlayerKey(gameId, playerKey))
      ? (await this.generatePlayerKey(gameId))
      : playerKey
  }

  getPlayer (): Types.Player {
    // log('getPlayer!!!!')
    const playerId: Types.PlayerId = this.model.player.id
    return Object.values(this.model.game.players).filter(player => player.id === playerId)[0]
  }

  getOtherPlayers (): Types.Player[] {
    // log('getPlayer!!!!')
    return this.model.game.players
      ? Object.values(this.model.game.players).filter(player => player.id !== this.model.player.id)
      : []
  }

  updateName (name: string) {
    // log('updateName!!!!')
    this.model.player.name = name
  }

}
