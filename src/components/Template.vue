<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import * as Types from "../class/types"

@Component
export default class Xxx extends Vue {
  @Prop() private prop!: {}

  updated() {
    this.$emit("updated")
  }
}
</script>

<style scoped lang="scss">
/* sp */
@media only screen and (max-width: 600px) {
}
</style>
