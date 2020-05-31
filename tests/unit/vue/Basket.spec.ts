import { shallowMount } from "@vue/test-utils"
import Basket from "@/components/Game/Basket.vue"
import * as Types from '@/class/types'
import mockModel from "./mockdata/model.json"
type Model = { game: Types.Game, player: Types.Player}

const factory = (basket: Types.Basket) =>{
  const model = mockModel as Model
  model.game.basket = basket
  return shallowMount(Basket, { propsData: { model } })
}

describe("Basket.vue", () => {
  it("バスケットが1枚以上ある", () => {
    const wrapper = factory([{ card: "あ" as Types.Card, hadPlayerId: 1}])
    expect(wrapper.find('.card').text()).toBe("あ")
  })
  it("バスケットが0枚", () => {
    const wrapper = factory([])
    expect(wrapper.find('.card').text()).toBe("")
  })
})
