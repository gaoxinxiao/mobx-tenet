import { useRef, useReducer } from 'react'
import { Reaction } from 'mobx'

function observerComponentNameFor(component) {
    return `${component}&observed`
}

function useObserver(fn, baseComponentName = 'observed', options = {}) {

    const [, forceUpdate] = useReducer(x => x + 1, 0)

    const reactionTrackRef = useRef(null)

    if (!reactionTrackRef.current) {
        reactionTrackRef.current = {
            reaction: new Reaction(
                observerComponentNameFor(baseComponentName),
                () => {
                    forceUpdate()
                }
            )
        }
    }

    const { reaction } = reactionTrackRef.current

    let rendering = null

    reaction.track(() => {
        //监听更新
        rendering = fn()
    })

    return rendering
}

export {
    useObserver
}