import React, { useState, useEffect } from 'react';

const getInitialState = (settings, maxIndex, get, dataObject) => {
  const { itemWidth, tolerance, startIndex, amount } = settings

  //The calculate the visible width that render
  const viewportWidthX = amount * itemWidth

  //Find the max width of the entire scorller
  const totalwidth = (maxIndex + 1) * itemWidth

  //the height of one the buffer sournding the visible viewport
  const tolerancewidth = tolerance * itemWidth

  //the total width of the table that is being render
  const bufferWidth = viewportWidthX + 2 * tolerancewidth

  //the total amount of item that is being render
  const bufferedItems = amount + 2 * tolerance

  //the total item that is to the left of the table
  const itemsLeft = startIndex - tolerance

  //calculate the amount of space base on the amount of items on the left
  const leftPaddingWidth = itemsLeft * itemWidth

  //calculate the amount of space base on the left padding
  const rightPaddingWidth = totalwidth - leftPaddingWidth

  //the index inital visiable element to the user
  const initialPosition = leftPaddingWidth + tolerancewidth

  return {
    settings,
    viewportWidthX,
    totalwidth,
    tolerancewidth,
    bufferWidth,
    bufferedItems,
    leftPaddingWidth,
    rightPaddingWidth,
    initialPosition,
    data: get(0, amount + tolerance, dataObject)
  }
}

const getNewState = (state, get, dataObject, scrollRight) => {
  const { totalwidth, tolerancewidth, bufferedItems, settings: { itemWidth } } = state
  //update initial postion of the user
  const index = Math.floor((scrollRight - tolerancewidth) / itemWidth)

  //get the amount of data that is needed to render
  const data = get(index, bufferedItems, dataObject)

  //calculate the amount of left pading base on the new index
  const leftPaddingWidth = Math.max((index) * itemWidth, 0)

  //calcuate the amount of right padding
  const rightPaddingWidth = Math.max(totalwidth - leftPaddingWidth - data.length * itemWidth, 0)

  return {
    ...state,
    leftPaddingWidth,
    rightPaddingWidth,
    data
  }
}

//get the props from APP
const Scroller = ({ get, template, settings, dataObject }) => {

  //set intial state
  const [state, setState] = useState(() => getInitialState(settings, dataObject[0].length, get, dataObject))

  //useEffect only trigger when get,settings, and state.initialPostion had change,
  //but in component most of time it will be trigger by initialPostion becase when user
  // scroll initialPostion will be updatad
  useEffect(() => {
    //This function handles the scroll
    const runScroller = () => setState(s => getNewState(s, get, dataObject, window.scrollX))

    //Add event listener to detect whenever user scroll and call the function runScroller
    // whenever it trigger
    window.addEventListener('scroll', runScroller, { passive: true })

    //This will move the scroller to a correct position
    //If this is not added the data will move to a incorrect position
    window.scroll(state.initialPosition, 0)

    //Unmount the event lister
    return () => window.removeEventListener('scroll', runScroller)
  }, [get, settings, state.initialPosition])

  return (
    <>
      <span style={{ paddingLeft: state.leftPaddingWidth }}></span>
      <table>
        <tbody>
          {template(state.data)}
        </tbody>
      </table>
      <span style={{ paddingRight: state.rightPaddingWidth }}></span>
    </>
  )
}

export default Scroller
