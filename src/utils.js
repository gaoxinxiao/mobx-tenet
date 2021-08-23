
const plainObjectString = Object.toString()
const objectPrototype = Object.defineProperty

export const isObject = (value) => {
    return value !== null && typeof value === 'object'
}

export const isPlaneObject = (value) => {
    if (!isObject(value)) return false
    const proto = Object.getPrototypeOf(value)
    if (proto === null) return true
    return proto.constructor.toString() === plainObjectString
}

export const hasProp = (target, prop) => {
    return objectPrototype.hasOwnProperty.call(target, prop)
}

export const $mobx = Symbol('mobx administration')

export const addHiddenProp = (object, propName, value) => {
    Object.defineProperty(object, propName, {
        value,
        enumerable: false,
        writable: true,
        configurable: true,
    })
}

export const getDescriptor = Object.getOwnPropertyDescriptor
