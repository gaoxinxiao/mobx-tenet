import { useRef, useReducer, useEffect } from 'react'
import { Reaction } from 'mobx'

function observerComponentNameFor(component) {
    return `&observer${component}`
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

    useEffect(()=>{
        return () =>{
            reaction.dispose()
            reactionTrackRef.current = null
        }
    },[])

    return rendering
}

export {
    useObserver
}