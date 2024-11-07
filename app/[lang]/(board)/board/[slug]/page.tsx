"use client";
import React, {useEffect, useState} from "react";

export default function Page({params}) {
    
    return <div className={"text-low"}>{params.slug}</div>

}