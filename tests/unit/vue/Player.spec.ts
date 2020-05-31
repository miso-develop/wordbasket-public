import { shallowMount } from "@vue/test-utils"
import Player from "@/components/Game/Player.vue"
import * as Types from '@/class/types'
import mockModel from "./mockdata/model.json"
type Model = { game: Types.Game, player: Types.Player}

const factory = (hand: Types.Hand) =>{
  const model = mockModel as Model
  model.player.hand = hand
  return shallowMount(Player, { propsData: { model } })
}

describe("Player.vue", () => {
  it("手札が1枚以上ある", () => {
    const wrapper = factory(["ま", "ち", "W5", "み", "せ"])
    expect(wrapper.find('.card').exists()).toBeTruthy()
  })
  it("手札が0枚", () => {
    const wrapper = factory([])
    expect(wrapper.find('.card').exists()).toBeFalsy()
  })
})
