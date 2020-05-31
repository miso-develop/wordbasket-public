import { Game as Model } from "@/class/Game"
import * as Types from '@/class/types'
import Message from '@/json/message.json'
import initDeckDataJson from '@/json/init-deck-data.json'
import { escapeHTML, random, randomPop, zeroPadding, log, clog, sleep, isLocal } from '@/class/util'

export class Action {
  private model: Model

  constructor (model: Model) { this.model = model }



  async onAction(action: Function, actionType: string) {
    try {
      await action()
      this.model.toast.set(actionType)
      await this.model.database.updateGame()
    } catch (e) {
      console.error(e)
      this.model.toast.show(e.message)
    }
  }



  async startGame () {
    // log('startGame!!!!')
    const game = this.model.game
    // 勝利数カウントアップ
    this.countUpWin()
    // ゲームカウントアップ
    game.count++
    // 山札初期化
    game.deck = [...initDeckDataJson] as Types.Deck
    // ランダムに手札に配る
    this.handout()
    // バスケットを初期化して一枚だす（ワイルドカードならもっかい出す）
    game.basket = []
    await this.resetBasket()
  }

  private countUpWin () {
    // log('countUpWin!!!!')
    if (this.model.game.count === 0) return
    Object.values(this.model.game.players).forEach(player => {
      if (player.hand.length === 0) player.winCount++
    })
  }

  private handout () {
    // log('handout!!!!')
    const DEFAULT_HAND_NUMBER = 5
    Object.values(this.model.game.players).forEach(player => {
      player.hand = this.drawCards(DEFAULT_HAND_NUMBER)
    })
  }

  // 山札からランダムにカードをひく
  private drawCards (count: number): Types.Card[] {
    // log('drawCards!!!!', count)
    const deck = this.model.game.deck

    // 山札が0だったらエラー
    this.checkDeckEmpty()

    // 山札が尽きそうだったらバスケットから補充
    if (deck.length <= count) this.resetDeck()

    // 補充後でも足りないならエラ0
    if (deck.length < count) this.checkDeckEmpty()

    const cards: Types.Card[] = []
    for (let i = 0; i < count; i++) {
      const card = randomPop(deck)
      cards.push(card)
    }
    return cards
  }

  private checkDeckEmpty () {
    // log('checkDeckEmpty!!!!')
    if (this.model.game.deck.length <= 0) throw new Error(Message.Error.EMPTY_DECK)
  }



  private resetDeck () {
    // log('resetDeck!!!!')
    const game = this.model.game

    // バスケットを最後のカードだけにする
    const lastCard = game.basket.pop() as Types.History
    const basketCards = game.basket.map((history) => history.card)
    game.basket = [lastCard]

    // バスケットの他のカードを山札に補充
    game.deck = [...game.deck, ...basketCards]
  }



  async resetBasket () {
    // log('resetBasket!!!!')
    const card = this.drawCards(1)[0]
    // MEMO: playerIdが`-1`なら山札からってこと
    this.model.game.basket.push({ card, hadPlayerId: -1 })

    // ワイルドカードだったら再帰処理
    if (this.isWildCard(card)) await this.resetBasket()
  }



  // TODO:山札へは戻さないようにする？
  reject () {
    // log('reject!!!!')
    if (this.model.game.basket.length <= 1) throw new Error(Message.Error.CANT_REJECT)

    const { card, hadPlayerId } = this.model.game.basket.pop() as Types.History
    if (hadPlayerId > -1) {
      Object.values(this.model.game.players).filter(player => player.id === hadPlayerId)[0].hand.push(card)
    } else {
      this.model.game.deck.push(card)
    }
  }



  penalty () {
    // log('penalty!!!!')
    // TODO: 対象選択状態へ
    // TODO: とりあえず自分で引いてもらう仕様で
    this.model.player.hand.push(this.drawCards(1)[0])
  }



  // TODO: バスケットに表示されるカード選択を行ったほうがいいかな
  // TODO: とりあえずランダムで簡易実装
  async resetHand () {
    // log('resetHand!!!!')
    if (!this.canResetHand()) this.checkDeckEmpty()

    const resetNum = this.model.player.hand.length + 1
    await this.trashHand()
    this.model.player.hand = this.drawCards(resetNum)
  }

  private canResetHand (): boolean {
    return (this.model.game.deck.length + this.model.game.basket.length) > 1
  }

  // すべての手札をランダムにバスケットへ
  private async trashHand () {
    // log('trashHand!!!!')
    while (this.model.player.hand.length) {
      const card = randomPop(this.model.player.hand)
      this.model.game.basket.push({
        card,
        hadPlayerId: this.model.player.id
      })
      // TODO: ワイルドカード以外があるかチェッック
      // TODO: ワイルドカード以外をトップに
    }

    // TODO: 簡易実装：バスケットがワイルドカードだったら山札から再度引く
    const lastCard = ([...this.model.game.basket].pop() as Types.History).card
    if (this.isWildCard(lastCard)) await this.resetBasket()
  }



  throwCard (throwCard: Types.Card) {
    // log('throw!!!!')
    // MEMO: filterだと同名カードが全部消える…
    const throwCardIndex = this.model.player.hand.findIndex(card => card === throwCard)
    this.model.player.hand.splice(throwCardIndex, 1)

    this.model.game.basket.push({
      card: throwCard,
      hadPlayerId: this.model.player.id
    })
  }



  private isWildCard (card: Types.Card): boolean {
    // log('isWildCard!!!!')
    const WILD_CARDS: Types.Card[] = ['W5', 'W6', 'W7+']
    return WILD_CARDS.includes(card)
  }

  private isLineCard (card: Types.Card): boolean {
    // log('isLineCard!!!!')
    const LINE_CARDS: Types.Card[] = ['あ行', 'か行', 'さ行', 'た行', 'な行', 'は行', 'ま行', 'や行', 'ら行']
    return LINE_CARDS.includes(card)
  }



  onDeliberation () {
    // log('onDeliberation!!!!')
    this.model.game.deliberation = true
  }

  offDeliberation () {
    // log('offDeliberation!!!!')
    this.model.game.deliberation = false
  }

}
