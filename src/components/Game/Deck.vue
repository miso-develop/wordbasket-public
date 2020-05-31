<template>
  <div class="deck-block">
    <div @click="onResetBasket" class="card">山札<br />{{ deckLength }}</div>
    <button @click="onResetHand">手札リセット</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import { Game as Model } from "@/class/Game"

@Component
export default class Deck extends Vue {
  @Prop() private model!: Model

  get deckLength(): number {
    const deck = this.model.game.deck
    return deck ? deck.length : 0
  }

  async onResetBasket() {
    await this.model.action.onAction(
      async () => await this.model.action.resetBasket(),
      "resetBasket"
    )
  }

  async onResetHand() {
    await this.model.action.onAction(
      async () => await this.model.action.resetHand(),
      "resetHand"
    )
  }
}
</script>

<style scoped lang="scss">
.deck-block {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

/* sp */
@media only screen and (max-width: 600px) {
}
</style>
