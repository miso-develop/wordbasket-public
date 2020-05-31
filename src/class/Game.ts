import { Toasted } from "vue-toasted"
import { Database } from '@/class/Database'
import { GameManager } from "@/class/GameManager"
import { PlayerManager } from "@/class/PlayerManager"
import { ToastManager } from "@/class/ToastManager"
import { Action } from "@/class/Action"
import * as Types from '@/class/types'

import { escapeHTML, random, randomPop, zeroPadding, log, clog, sleep, isLocal } from '@/class/util'

export class Game {
  game: Types.Game = {} as Types.Game
  player: Types.Player = {} as Types.Player

  private _database: Database = new Database(this)
  private _gameManager: GameManager = new GameManager(this)
  private _playerManager: PlayerManager = new PlayerManager(this)
  private _toast: ToastManager = new ToastManager(this)
  private _action: Action = new Action(this)

  get database(): Database { return this._database }
  get gameManager(): GameManager { return this._gameManager }
  get playerManager(): PlayerManager { return this._playerManager }
  get toast(): ToastManager { return this._toast }
  get action(): Action { return this._action }



  async init($toasted: Toasted) {
    this.toast.init($toasted)

    this.game = await this.gameManager.getGame()
    this.player = await this.playerManager.addPlayer()

    this.database.setOn(this.update())
  }

  private update () {
    return async (game: Types.Game) => {
      this.game = game
      this.player = this.playerManager.getPlayer()

      await this.toast.showLog()
    }
  }
}
