import React from "react";
export const EmbloyV = ({children, className}) => {
    return (
        <div className={`flex w-full flex-col items-start justify-start ${className}`}>
            {children}
        </div>
    );
}

export const EmbloyH = ({children, className}) => {
    return (
        <div className={`flex w-full flex-row items-start justify-start ${className}`}>
            {children}
        </div>
    );
}

export const EmbloyLHPV = ({children, className}) => {
    return (
        <div className={`flex w-full items-start justify-start portrait:flex-col landscape:flex-row ${className}`}>
            {children}
        </div>
    );
}

export const EmbloyLVPH = ({children, className}) => {
    return (
        <div className={`flex w-full items-start justify-start portrait:flex-row landscape:flex-col ${className}`}>
            {children}
        </div>
    );
}



export const EmbloySpacer = ({className}) => {
    return (
        <div className={`h-20 w-full ${className}`} />
    );
}