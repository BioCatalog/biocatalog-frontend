import { Slot } from "expo-router";
import Header from "@/components/layout/header";
import React from "react";
// import "@/global.css";

export default function Layout() {
    return (
        <>
            <Header />
            <Slot />
        </>
    )
}