import React from "react";

const getInitalState = ({amount,itemHeight,max,min,tolerance,start})=>{
    const viewportHeight = amount * itemHeight;
    const totalHeight = (max - min + 1) * itemHeight;
    const toleranceHeight = tolerance * itemHeight;
    const bufferHeight = viewportHeight + 2 * toleranceHeight;
    const bufferedItems = amount + 2 * tolerance;
    const itemsAbove = start - tolerance - min;
    const topPaddingHeight = itemsAbove * itemHeight;
    const bottomPaddingHeight = totalHeight - topPaddingHeight
    const initialPosition = topPaddingHeight + toleranceHeight
    return {
        viewportHeight,
        totalHeight,
        toleranceHeight,
        bufferHeight,
        bufferedItems,
        itemsAbove,
        topPaddingHeight,
        bottomPaddingHeight,
        initialPosition,
        infoArray: []
    }
}

const getNewState = (state, settings,data, scrollTop) => {
    const index = settings.min + Math.floor((scrollTop - state.toleranceHeight) / settings.itemHeight);
    const infoArray = data(index, state.bufferedItems);
    const topPaddingHeight = Math.max((index - settings.min) * settings.itemHeight, 0);
    const bottomPaddingHeight = Math.max(state.totalHeight - state.topPaddingHeight - state.infoArray.length * settings.itemHeight, 0);

    return {
        ...state,
        topPaddingHeight,
        bottomPaddingHeight,
        infoArray
    }
}

function VirtualScroller(props) {
    const [postionSetting, setPositionSetting] = React.useState(getInitalState(props.settings));
    React.useEffect(() => {
        const handleScroller = () => {
            setPositionSetting(state => {
                return getNewState(state, props.settings,props.data, window.scrollY)
            })
        }
        window.addEventListener("scroll", handleScroller, {passive: true});
        window.scroll(0, postionSetting.initialPosition);
        if (!postionSetting.initialPosition) {
            handleScroller();
          }
        return() => window.removeEventListener("scroll", handleScroller);
    }, [props.data, props.settings, postionSetting.initialPosition])

    return <> < div style = {{height:postionSetting.topPaddingHeight}}/>
        {postionSetting.infoArray.map(props.row)}
        <div style={{height:postionSetting.bottomPaddingHeight}}/ > </>
}

export default VirtualScroller;
