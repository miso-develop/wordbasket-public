<template>
  <div class="game-info">
    <div>
      <p>Game ID:</p>
      <input v-model="model.game.id" class="game-id" />
    </div>
    <div class="game-info-buttons">
      <button @click="onMoveGame">部屋を移動</button>
      <button @click="onCopyUrl">URLをコピー</button>
      <!-- TODO: -->
      <!-- <button @click="onGameStart" v-if="model.player.master"> -->
      <button @click="onGameStart">
        ゲーム開始
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import { Game as Model } from "@/class/Game"
import Message from "@/json/message.json"

@Component
export default class Header extends Vue {
  @Prop() private model!: Model

  onMoveGame() {
    // TODO: 退室処理いる？
    location.href = `./?${this.model.game.id}`
  }

  onCopyUrl() {
    const baseUrl = location.href.replace(location.search, "")
    const url = `${baseUrl}?${this.model.game.id}`
    navigator.clipboard.writeText(url)

    this.model.toast.show(Message.URL_COPY)
  }

  async onGameStart() {
    await this.model.action.onAction(
      async () => await this.model.action.startGame(),
      "gameStart"
    )
  }
}
</script>

<style scoped lang="scss">
.game-info {
  display: flex;
  justify-content: center;
  align-items: center;

  div {
    display: flex;
    align-items: center;
  }

  p {
    font-size: 2rem;
  }

  button {
    width: auto;
    margin-left: 2rem;
    padding: 0.5rem 1rem !important;
  }
}

.game-id {
  font-size: 1.5rem;
  width: 4rem;
  padding: 0.5rem 1rem !important;
}

/* sp */
@media only screen and (max-width: 600px) {
  .game-info {
    flex-direction: column;
    width: 100%;

    p {
      font-size: 1.5rem;
    }

    button {
      margin-left: 0.5rem;
      width: 7rem;
      font-size: 0.8rem;
    }
  }

  .game-info-buttons {
    width: 100%;
    justify-content: space-evenly;
  }
}
</style>
