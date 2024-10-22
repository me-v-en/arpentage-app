"use client"

import { ChangeEvent, useState } from "react"

export default function AuthForm() {

    const [username, setUsername] = useState("")

    const handleInput = (e: ChangeEvent<HTMLInputElement>)=> {
        setUsername(e.target.value)
    }

    return (
        <>
            <p>{username}</p>
            <input type="text" value={username} onChange={handleInput}></input>
        </>
    )
}