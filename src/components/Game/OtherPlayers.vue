<template>
  <div class="players-block">
    <div class="players">
      <div
        v-for="player in otherPlayers"
        :key="player.id"
        class="card players-card"
      >
        <div class="name">{{ player.name }}</div>
        <div class="hand-number">{{ player.hand.length }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import { Game as Model } from "@/class/Game"
import * as Types from "@/class/types"

@Component
export default class OtherPlayers extends Vue {
  @Prop() private model!: Model

  get otherPlayers(): Types.Player[] {
    return this.model.playerManager.getOtherPlayers()
  }
}
</script>

<style scoped lang="scss">
.players-block {
  display: flex;
  justify-content: center;
  align-items: center;

  height: 9rem;
}

.players {
  display: flex;
}

.players-card {
  justify-content: space-evenly !important;

  width: 5rem !important;
  min-width: 5rem !important;
  height: 7.1rem !important;

  padding: 0 !important;

  .name {
  }

  .hand-number {
    font-size: 2rem;
  }
}

/* TODO: 未使用 */
/* ペナルティ対象選択エフェクト */
.penalty-select {
  background-color: #bfb;
  border-color: #0f0;
  filter: drop-shadow(0 0 0.5rem #4f4);
}

/* sp */
@media only screen and (max-width: 600px) {
  .players-block {
    height: 6.5rem;
  }

  .players-card {
    width: 2.75rem;
    height: 5rem;

    margin: 0.25rem;

    .name {
      font-size: 0.5rem;
    }

    .hand-number {
      font-size: 1.5rem;
    }
  }
}
</style>
