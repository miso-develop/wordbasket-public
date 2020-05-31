import { shallowMount } from "@vue/test-utils"
import Deliberation from "@/components/Game/Deliberation.vue"
import * as Types from '@/class/types'
import mockModel from "./mockdata/model.json"
type Model = { game: Types.Game, player: Types.Player}

const factory = (deliberation: boolean) =>{
  const model = mockModel as Model
  model.game.deliberation = deliberation
  return shallowMount(Deliberation, { propsData: { model } })
}

describe("Deliberation.vue", () => {
  it("非審議中", () => {
    const wrapper = factory(false)
    expect(wrapper.isVisible()).toBeFalsy()
  })
  it("審議中", () => {
    const wrapper = factory(true)
    expect(wrapper.isVisible()).toBeTruthy()
  })
})
