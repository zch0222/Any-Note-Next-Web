"use client"

import {redirect} from 'next/navigation';
import {ls} from "@/app/utils/storage";

export function Auth() {
    console.log('auth...')
    const token = ls.get('accessToken');
    if (!token) {
        return redirect('/login')
    } else {
        return redirect('/dashboard')
    }
}


