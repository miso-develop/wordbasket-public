<template>
  <div>
    <Deliberation :model="this.model" />

    <div class="game">
      <Header :model="this.model" />

      <OtherPlayers :model="this.model" />

      <div id="center-block">
        <Buttons :model="this.model" />
        <Basket :model="this.model" />
        <Deck :model="this.model" />
      </div>

      <Player :model="this.model" />
    </div>

    <Debug :model="this.model" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import Header from "@/components/Game/Header.vue"
import OtherPlayers from "@/components/Game/OtherPlayers.vue"
import Buttons from "@/components/Game/Buttons.vue"
import Basket from "@/components/Game/Basket.vue"
import Deck from "@/components/Game/Deck.vue"
import Player from "@/components/Game/Player.vue"
import Debug from "@/components/Game/Debug.vue"
import Deliberation from "@/components/Game/Deliberation.vue"

import Toasted from "vue-toasted"
import { polyfill } from "mobile-drag-drop"
import { scrollBehaviourDragImageTranslateOverride } from "mobile-drag-drop/scroll-behaviour"

import _ from "lodash"
import { Game as Model } from "@/class/Game"
import { log, clog } from "@/class/util"

// mobile-drag-drop
const usePolyfill = polyfill({
  dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride
})
if (usePolyfill) {
  document.addEventListener("dragenter", event => event.preventDefault())
  window.addEventListener("touchmove", event => event, { passive: false })
}

Vue.use(Toasted)

@Component({
  components: {
    Deliberation,
    Header,
    OtherPlayers,
    Buttons,
    Basket,
    Deck,
    Player,
    Debug
  }
})
export default class Game extends Vue {
  model: Model = new Model()

  // vue events
  async created() {
    // log("created!!!!")

    // Game生成
    await this.model.action.onAction(
      async () => await this.model.init(this.$toasted),
      "created"
    )

    // load end
    this.$emit("loaded")
  }
}
</script>

<style lang="scss">
@import "./Game.scss";
</style>
