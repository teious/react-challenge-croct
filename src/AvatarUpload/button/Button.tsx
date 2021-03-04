import React, { ComponentProps } from 'react';
import './Button.css';

const Button: React.FC<ComponentProps<'button'>> = (props) => {

    return (<button className="button" {...props}>
        {props.children}
    </button>)
}
export default Button;