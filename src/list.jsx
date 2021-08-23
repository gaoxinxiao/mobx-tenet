// import { observer, Observer } from 'mobx-react'
import Store from './Store/store'
import { useObserver, observer, Observer } from './lhc-mobx-react'

// const List = () => {
//     return <Observer>
//         {() => <>
//             点赞量：{Store.count}
//             <button onClick={Store.setCount}>更新点赞量</button></>}
//     </Observer>
// }

// const List = observer(() => {
//     return <>
//         点赞量：{Store.count}
//         <button onClick={Store.setCount}>更新点赞量</button></>
// })

const List = () => {
    return useObserver(() => <>
        点赞量：{Store.count}
        <button onClick={Store.setCount}>更新点赞量</button></>
    )
}

export default List
