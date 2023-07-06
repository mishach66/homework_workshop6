import React from "react";

const Button = (props) => {
    const onClick = () => {
        if (props.onClick)
            props.onClick()
    }

    return (
        <>
            <div style={{display: "inline-block"}} >
                <button onClick={onClick} disabled={props.disabled}>{props.children} </button>
            </div>
        </>
    )
}

export default Button
