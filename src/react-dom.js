//vnode 虚拟dom节点
//node 真实dom节点

/**
 * filber节点属性
 * child 子节点
 * sibling 兄弟节点
 * retur 父节点
 * stateNode 指向真实dom节点
 * 
*/

//下一个要执行的任务
let nextUnitOfWork = null
let wipRoot = null // word in progress


function render(vnode, container) {
    //01

    wipRoot = {
        type: 'div',
        props: { children: { ...vnode } },
        stateNode: container
    }

    nextUnitOfWork = wipRoot
}

//如果是字符串或者数字都当是文本
function isStringOrNumber(type) {
    //04
    return typeof type === 'string' || typeof type === 'number'
}

function createNode(workInProgress) {
    //02


    const { type, props } = workInProgress
    let node = document.createElement(type)

    updateNode(node, props)

    return node
}

function updateClassComponent(vnode) {
    // 09
    const { type, props } = vnode
    const instance = new type(props)
    const child = instance.render()

    const node = createNode(child)

    return node

}

function updateFunComponent(workInProgress) {
    // 08
    const { type, props } = workInProgress
    let child = type(props)

    reconcileChildren(workInProgress, child)

}

//生成节点
function updateHostComponent(workInProgress) {
    //03

    if (!workInProgress.stateNode) {
        //首次渲染没有dom节点需要生成
        workInProgress.stateNode = createNode(workInProgress)
    }

    //协调子节点
    reconcileChildren(workInProgress, workInProgress.props.children)

    console.log(workInProgress)
    // const { type, props } = vnode
    // let node = document.createElement(type)

    // //更新属性
    // updateNode(node, props)

    // //遍历子节点
    // reconcileChildren(node, props.children)

    // return node
}

function updateNode(node, nextVal) {
    // 07
    Object.keys(nextVal).forEach(key => {
        if (key === 'children') {
            //如果childr是字符串或者数字需要插入父节点内
            if (isStringOrNumber(nextVal[key])) {
                node.textContent = nextVal[key]
            }
        } else {
            node[key] = nextVal[key]
        }
    })
    return node
}

function reconcileChildren(workInProgress, children) {

    // 06
    if (isStringOrNumber(children)) {
        //如果是文本节点直接退出不需要在生成fiber
        return
    }

    const newChildren = Array.isArray(children) ? children : [children]

    let prevNewFiber = null //记录上一轮fiber
    for (let i = 0; i < newChildren.length; i++) {
        let child = newChildren[i]

        //生成fiber对象
        let newFilber = {
            key: child.key,
            type: child.type,
            props: { ...child.props },
            stateNode: null,
            child: null,
            sibling: null,
            return: workInProgress
        }
        if (i === 0) {
            //newFilber 是 workInProgress的第一个子fiber
            workInProgress.child = newFilber
        } else {
            prevNewFiber.sibling = newFilber
        }

        prevNewFiber = newFilber
    }
}

function updateTextComponent(vnode) {
    //05
    const node = document.createTextNode(vnode)

    return node
}

//正在执行的任务workInProgress
function performUnitOfWork(workInProgress) {
    //11

    //1.执行当前任务
    const { type } = workInProgress

    if (typeof type === 'string') {
        updateHostComponent(workInProgress)
    } else if (typeof type === 'function') {
        updateFunComponent(workInProgress)
    }

    //2.返回下一个任务
    while (workInProgress.child) {
        return workInProgress = workInProgress.child
    }

    let nextFiber = workInProgress
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling
        }
        nextFiber = nextFiber.return
    }



}

function workLoop(IdleDeadline) {
    // 10
    //有任务并且有空闲时间的情况
    while (nextUnitOfWork && IdleDeadline.timeRemaining() > 1) {
        //执行每个任务
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    }

    //最后提交任务
    if (!nextUnitOfWork && wipRoot) {
        commitRoot()
    }
}

//提交
function commitWorker(workInProgress) {
    // 13
    if (!workInProgress) {
        //自己不存在直接返回
        return
    }

    let parentNodeFiber = workInProgress.return

    while (!parentNodeFiber.stateNode) {
        parentNodeFiber = parentNodeFiber.return
    }

    let parentNode = parentNodeFiber.stateNode

    if (workInProgress.stateNode) {
        parentNode.appendChild(workInProgress.stateNode)
    }

    //提交自己
    commitWorker(workInProgress.child)
    //提交兄弟
    commitWorker(workInProgress.sibling)
}

function commitRoot() {
    //12
    commitWorker(wipRoot.child)

    //防止重复提交
    wipRoot = null
}

//利用浏览器空闲时间
requestIdleCallback(workLoop)

export default { render }

