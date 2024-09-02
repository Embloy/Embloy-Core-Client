import React from "react";
export const EmbloyV = ({children, className}) => {
    return (
        <div className={`w-full flex flex-col items-start justify-start ${className}`}>
            {children}
        </div>
    );
}

export const EmbloyH = ({children, className}) => {
    return (
        <div className={`w-full flex flex-row items-start justify-start ${className}`}>
            {children}
        </div>
    );
}

export const EmbloyLHPV = ({children, className}) => {
    return (
        <div className={`w-full flex landscape:flex-row portrait:flex-col items-start justify-start ${className}`}>
            {children}
        </div>
    );
}

export const EmbloyLVPH = ({children, className}) => {
    return (
        <div className={`w-full flex landscape:flex-col portrait:flex-row items-start justify-start ${className}`}>
            {children}
        </div>
    );
}



export const EmbloySpacer = ({className}) => {
    return (
        <div className={`w-full h-20 ${className}`} />
    );
}