<template>
  <div v-if="debug" class="debug">
    <button @click="onDebug1">debug1</button>
    <button @click="onDebug2">debug2</button>
    <button @click="onDebug3">debug3</button>
    <button @click="onDebug4">debug4</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import { Game as Model } from "@/class/Game"
import * as Types from "@/class/types"
import { log, clog, sleep, isLocal } from "@/class/util"

@Component
export default class Debug extends Vue {
  @Prop() private model!: Model

  private debug = isLocal()
  private debugLog = (...v: any) => this.debug && console.log(...v)

  async onDebug1() {
    this.debugLog("onDebug1!!!!")
    this.debugLog(this.model.game)
  }

  async onDebug2() {
    this.debugLog("onDebug2!!!!")
    // this.debugLog(this.game)
  }

  async onDebug3() {
    this.debugLog("onDebug3!!!!")
    // this.debugLog(this.game)
  }

  async onDebug4() {
    this.debugLog("onDebug4!!!!")
    // this.debugLog(this.game)
    this.model.database.reset()
  }
}
</script>

<style scoped lang="scss">
.debug {
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    width: auto;
  }
}

/* sp */
@media only screen and (max-width: 600px) {
}
</style>
