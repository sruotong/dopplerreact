import React from 'react';
import './velocityinput.css';

export function VelocityInput(props) {
    return (
        <label>
            Velocity:
            <input type="number" max="100" min="-1" value={props.value} onChange={(e) => props.velocityChange(e)} />
            km/s
        </label>
    );
}