<template>
  <div class="player">
    <div class="hand">
      <div
        v-for="card in model.player.hand"
        :key="card.id"
        draggable
        @dragstart="onThrowDrag($event, card)"
        class="card"
      >
        {{ card }}
      </div>
    </div>

    <div class="player-name">
      <input :value="model.player.name" @change="onUpdateName($event)" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import { Game as Model } from "@/class/Game"

@Component
export default class Player extends Vue {
  @Prop() private model!: Model

  async onUpdateName(event: any) {
    await this.model.action.onAction(
      async () => this.model.playerManager.updateName(event.target.value),
      ""
    )
  }

  onThrowDrag(event: any, card: string) {
    event.dataTransfer.setData("card", card)
  }
}
</script>

<style scoped lang="scss">
.player {
  display: flex;
  flex-direction: column;

  max-width: 100%;
  overflow: auto;

  .hand {
    display: flex;
    min-height: 13rem;

    .card:only-child {
      // TODO: 固定値なんとかならないかな…
      margin-left: 21%;
    }
  }

  .player-name {
    display: flex;
    justify-content: center;
  }
}

/* sp */
@media only screen and (max-width: 600px) {
  .player {
    overflow: auto;

    .hand {
      min-height: 6.5rem;

      .card:only-child {
        // TODO: 固定値なんとかならないかな…
        margin-left: 35%;
      }
    }
  }
}
</style>
