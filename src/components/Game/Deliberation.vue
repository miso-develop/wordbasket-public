<template>
  <div v-show="model.game.deliberation" class="deliberation">
    <p>審議中</p>
    <button @click="onEndDeliberation">審議終了</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import { Game as Model } from "@/class/Game"

@Component
export default class Deliberation extends Vue {
  @Prop() private model!: Model

  async onEndDeliberation() {
    await this.model.action.onAction(
      async () => this.model.action.offDeliberation(),
      "endDeliberation"
    )
  }
}
</script>

<style scoped lang="scss">
@keyframes blinkAnime {
  0% {
    color: #888;
  }
  100% {
    color: #444;
  }
}

.deliberation {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  width: 100%;
  height: 100%;
  background: rgba(128, 128, 128, 0.25);
  position: fixed;
  top: 0;
  left: 0;

  p {
    margin: 0;
    margin-bottom: 2rem;
    font-size: 10rem;
    color: #666;
    animation: blinkAnime 1s infinite alternate;
  }

  button {
    color: #444;
    font-size: 5rem;
    border: solid 0.1em #666;
    border-radius: 0.5em;
    padding: 0.25em 0.5em;
    width: auto;
  }
}

/* sp */
@media only screen and (max-width: 600px) {
  .deliberation {
    p {
      font-size: 5rem;
    }

    button {
      font-size: 2.5rem;
      background-color: #fff;
    }
  }
}
</style>
