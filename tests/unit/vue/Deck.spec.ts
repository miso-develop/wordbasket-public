import { shallowMount } from "@vue/test-utils"
import Deck from "@/components/Game/Deck.vue"
import * as Types from '@/class/types'
import mockModel from "./mockdata/model.json"
type Model = { game: Types.Game, player: Types.Player}

const factory = (deck: Types.Deck) =>{
  const model = mockModel as Model
  model.game.deck = deck
  return shallowMount(Deck, { propsData: { model } })
}

describe("Deck.vue", () => {
  it("山札が1枚以上ある", () => {
    const wrapper = factory(["あ" as Types.Card])
    expect(wrapper.find('.card').text()).toBe("山札1")
  })
  it("山札が0枚", () => {
    const wrapper = factory([])
    expect(wrapper.find('.card').text()).toBe("山札0")
  })
})
