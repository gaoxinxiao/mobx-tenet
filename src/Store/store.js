import { observable, action, configure } from 'mobx'

configure({ enforceActions: 'observed' })

class Store {

    @observable count = 0

    @action.bound setCount() {
        this.count++
        console.log('点赞'+this.count)
    }

}


let store = new Store()

export default store