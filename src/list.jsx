// import { observer } from 'mobx-react'
import Store from './Store/store'
import { useObserver } from './lhc-mobx-react'

const List = () => {
    return useObserver(() => <>
        点赞量：{Store.count}
        <button onClick={Store.setCount}>更新点赞量</button>
    </>)
}

export default List
