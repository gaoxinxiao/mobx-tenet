// import { observable, action, configure } from 'mobx'
import { observable, action } from '../lhc-mobx'

const state = observable({
    count: 1
})

state.setCount = action(() => {
    state.count++
})

export default state