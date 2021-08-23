import React, { useRef, useReducer, useEffect, memo, forwardRef, Component } from 'react'
import { Reaction } from 'mobx'

function observerComponentNameFor(component) {
    return `&observer${component}`
}

/**
 * @fn 执行的回调
 * @baseComponentName 组件标识
 * @options 其他操作
*/
function useObserver(fn, baseComponentName = 'observed', options = {}) {

    //创建强制更新api
    const [, forceUpdate] = useReducer(x => x + 1, 0)

    //创建ref存储reaction
    const reactionTrackRef = useRef(null)

    if (!reactionTrackRef.current) {
        reactionTrackRef.current = {
            reaction: new Reaction(
                observerComponentNameFor(baseComponentName),
                () => {
                    // 监测到数据更新的时候会执行
                    forceUpdate()
                }
            )
        }
    }

    const { reaction } = reactionTrackRef.current

    let rendering = null

    reaction.track(() => {
        //监听更新重新执行传进来的方法
        rendering = fn()
    })

    useEffect(() => {
        return () => {
            //组件执行完毕进行销毁
            reaction.dispose()
            reactionTrackRef.current = null
        }
    }, [])

    return rendering
}

function Observer({children, render}) {
    const component = children || render;
    return useObserver(component);
}

function observerLite(baseComponent, options = {}) {
    let realOptions = {
        forwardRef: false,
        ...options
    };
    const useWrappedComponent = (props, ref) => {
        // 将baseComponent和数据连接
        return useObserver(() => baseComponent(props, ref));
    };
    let memoComponent;
    if (realOptions.forwardRef) {
        //处理forwardRef
        memoComponent = memo(forwardRef(useWrappedComponent));
    } else {
        //mobx-react-lite内部的observer默认有React.memo行为，在这里加上
        memoComponent = memo(useWrappedComponent);
    }
    return memoComponent;
}

function observer(component, options) {
    // 处理forwardRef
    if (component["$$typeof"] === Symbol.for("react.forward_ref")) {
        const baseRender = component["render"];
        return React.forwardRef(function () {
            const args = arguments;
            //这里使用的Observer就是上面所说的第三种实现方式在下面会展示
            return <Observer>{() => baseRender.apply(undefined, args)}</Observer>;
        });
    }

    if (
        // 处理函数组件逻辑
        (typeof component === "function" && !component.prototype) ||
        !component.prototype.render
    ) {
        // observerLite是mobx-react-lite中的observer，怕命名冲突改成了observerLite
        return observerLite(component, options);
    }
    // 处理类组件
    return makeClassComponentObserver(component);
}

function makeClassComponentObserver(componentClass) {
    const target = componentClass.prototype;

    //获取class类的虚拟dom
    const baseRender = target.render;
    target.render = function () {
        //处理class类中的render
        return makeComponentReactive.call(this, baseRender);
    };
    return componentClass;
}

function makeComponentReactive(render) {
    const baseRender = render.bind(this);
    let isRenderingPending = false;
    //监听render
    const reaction = new Reaction(`${this.constructor.name}.render`, () => {
        if (!isRenderingPending) {
            isRenderingPending = true;
            //监测到数据变化强制更新视图
            Component.prototype.forceUpdate.call(this);
        }
    });

    this.render = reactiveRender;

    function reactiveRender() {
        isRenderingPending = false;
        let rendering = undefined;
        //更新render
        reaction.track(() => {
            rendering = baseRender();
        });

        return rendering;
    }

    return reactiveRender.call(this);
}

export {
    useObserver,
    observer,
    Observer
}