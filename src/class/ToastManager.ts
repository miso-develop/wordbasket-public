import { Game as Model } from "@/class/Game"
import { Toasted } from "vue-toasted"
import Message from "@/json/message.json"
import * as Types from '@/class/types'

import { escapeHTML, random, randomPop, zeroPadding, log, clog, sleep, isLocal } from '@/class/util'

export class ToastManager {
  private model: Model
  private $toasted: Toasted = {} as Toasted

  constructor(model: Model) {
    this.model = model
  }

  init($toasted: Toasted) {
    this.$toasted = $toasted
  }



  set(action: string) {
    // log('Toast.set!!!!')
    const playerName = this.model.player ? this.model.player.name : ""
    this.model.game.log = action === "throw"
      ? { player: playerName, action, card: this.getLastCard() }
      : { player: playerName, action }
  }

  private getLastCard(): Types.Card {
    return this.model.game.basket[this.model.game.basket.length - 1].card
  }



  async showLog() {
    const log = this.model.game.log

    // actionが空なら処理せず
    if (log.action === "") return

    // log("Toast.showLog!!!!")

    // toast表示
    const actionText = Message.ActionText[log.action].replace(
      "${card}",
      log.card
    )
    const playerName = log.player || "名無し"
    const toastText = `${playerName} さんが${actionText}`
    this.show(toastText)

    // toast出したらlog消す
    await this.clear()
  }

  private async clear() {
    // log('Toast.clear!!!!')
    this.model.game.log = { player: "", action: "" }
    await this.model.database.updateGame()
  }



  show(text: string) {
    // log("Toast.show!!!!")
    this.$toasted.show(escapeHTML(text), {
      theme: "outline",
      position: "top-right",
      duration: 2000
    })
  }

}
