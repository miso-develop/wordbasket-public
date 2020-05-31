<template>
  <div id="app">
    <Loading v-show="loading" />
    <Game v-show="!loading" @loaded="onLoaded" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import Loading from "@/components/Loading.vue"
import Game from "@/components/Game.vue"

@Component({
  components: {
    Loading,
    Game
  }
})
export default class App extends Vue {
  private loading = true

  onLoaded() {
    this.loading = false
  }
}
</script>

<style lang="scss">
* {
  font-family: "meiryo";
  font-size: 1.67vh;
  color: #333;
  user-select: none;
}

body {
  display: flex;
  flex-direction: column;
  margin: 0;
}

/* css */
@media only screen and (max-width: 600px) {
  * {
    font-size: 4vw;
  }
}
</style>
