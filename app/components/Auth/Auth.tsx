"use client"
import {ls} from "@/app/utils/storage";
import React, {useEffect, useState} from "react";
import {Redirect} from "@/app/components/Redirect";
import Loading from "@/app/components/Loading";

export const Auth = ({children}: { children: React.ReactNode }) => {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, [])

    if (!hasMounted) return <Loading/>;
    else {
        const token = ls.get('accessToken');
        if (!token) {
            return (
                <>
                    {children}
                </>
            );
        } else {
            return <Redirect to={"/dashboard"}/>
        }
    }
}



