import { isPlaneObject, hasProp, $mobx, addHiddenProp } from './utils'

const createObservable = (v) => {
    //判断是否是对象的方式
    if (isPlaneObject(v)) {
        return observable.object(v)
    }
}

class ObserverableObjectAdministration {
    constructor(_target) {
        this._target = _target
    }

    //添加属性
    _addObservableProp(propName, newValue) {
        this._target[propName] = newValue
    }
}

const asObservableObject = (target) => {

    if (hasProp(target, $mobx)) {
        //如果已经添加过这个属性直接返回
        return target[$mobx]
    }

    const adm = new ObserverableObjectAdministration(target)

    //调用工具函数变为响应式
    addHiddenProp(target, $mobx, adm)

    return adm
}

//添加响应式对象
const extendObservable = (target, props) => {
    //将target变为可观察模式 在返回
    const adm = asObservableObject(target)

    //遍历所有属性变为响应式
    Object.keys(props).forEach(key => {
        adm._addObservableProp(key, props[key])
    })

    return target
}

const observableFactories = {
    object: props => {
        return extendObservable({}, props)
    }
}

export const observable = Object.assign(createObservable, observableFactories)









const DEFAULT_ACTION_NAME = "<unnamed action>"
const tmpNameDescriptor = {
    value: "action",
    configurable: true,
    writable: false,
    enumerable: false
}

function untrackedStart() {
}

function _startAction(
    actionName,
    fn,
    scope,
    args
) {
    // 可能有 Derivation 正在重新计算，先暂停
    const prevDerivation = untrackedStart()
}

function _endAction(runInfo) {

}
const executeAction = (actionName, canRunAsDerivation, fn, scope, args) => {
    const runInfo = _startAction(actionName, canRunAsDerivation, scope, args)
    try {
        return fn.apply(scope, args)
    } finally {
        _endAction(runInfo)
    }
}

const createAction = (actionName, fn, autoAction, ref = null) => {
    function res() {
        return executeAction(actionName, autoAction, fn, ref || this, arguments)
    }
    res.isMobxAction = true
    tmpNameDescriptor.value = actionName
    Object.defineProperty(res, "name", tmpNameDescriptor)
    return res
}

const createActionFactory = (autoAction) => {
    const res = function action(arg1) {
        return createAction(arg1.name || DEFAULT_ACTION_NAME, arg1, autoAction)
    }
    return res
}
export const action = createActionFactory(false)
