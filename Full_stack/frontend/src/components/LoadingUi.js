import React from 'react'
import loadingUiGif from "../assests/loadingUi.gif"

export default function LoadingUi() {
    return (
        <div className='flex justify-center items-center' style={{ height: "98vh" }}>
            <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGUm-7ej7aDXbI1Md1L9irnRoMpBdI-OX6wA&s' alt="" className='' style={{ width: "100px", height: "100px" }} />
        </div>
    )
}
