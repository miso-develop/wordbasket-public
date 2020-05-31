<template>
  <div class="buttons">
    <button @click="onReject">差し戻し</button>
    <button @click="onPenalty">ペナルティ</button>
    <button @click="onDeliberation">審議</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import { Game as Model } from "@/class/Game"

@Component
export default class Buttons extends Vue {
  @Prop() private model!: Model

  async onReject() {
    await this.model.action.onAction(
      async () => this.model.action.reject(),
      "reject"
    )
  }

  async onPenalty() {
    await this.model.action.onAction(
      async () => this.model.action.penalty(),
      "penalty"
    )
  }

  async onDeliberation() {
    await this.model.action.onAction(
      async () => await this.model.action.onDeliberation(),
      "deliberation"
    )
  }
}
</script>

<style scoped lang="scss">
.buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

/* sp */
@media only screen and (max-width: 600px) {
}
</style>
