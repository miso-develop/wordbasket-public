<template>
  <div @drop="onThrowDrop" @dragover.prevent @dragenter.prevent class="basket">
    <div class="card">{{ lastCard }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import { Game as Model } from "@/class/Game"

@Component
export default class Basket extends Vue {
  @Prop() private model!: Model

  // compute
  get lastCard(): string {
    const basket = this.model.game.basket
    return basket && basket.length > 0 ? basket[basket.length - 1].card : ""
  }

  async onThrowDrop(event: any) {
    const throwCard = event.dataTransfer.getData("card")
    if (!throwCard) return

    await this.model.action.onAction(
      async () => this.model.action.throwCard(throwCard),
      "throw"
    )
  }
}
</script>

<style scoped lang="scss">
.basket {
  display: flex;
  justify-content: center;
  align-items: center;

  margin: 1rem 4rem;
  // padding: 1rem;

  width: 16rem;
  height: 16rem;

  border: solid 0.25rem #888;
  border-radius: 1rem;
}

/* sp */
@media only screen and (max-width: 600px) {
  .basket {
    margin: 1rem;

    width: auto;
    height: auto;
  }
}
</style>
