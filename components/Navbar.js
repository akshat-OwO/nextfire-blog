import Image from "next/image";
import Link from "next/link";

import { UserContext } from "@/lib/context";
import { useContext } from "react";

export default function Navbar({  }) {

    const { user, username } = useContext(UserContext);

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href='/'>
                        <button className="btn-logo">FEED</button>
                    </Link>
                </li>

                {/* user is signed-in and has username */}
                {username && (
                    <>
                        <li className="push-left">
                            <Link href='/admin'>
                                <button className="btn-blue">Write Posts</button>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/${username}`}>
                                <Image src={user?.photoURL} width={30} height={30} alt="user profile" />
                            </Link>
                        </li>
                    </>
                )}

                {/* user is not signed-in OR has not created username */}
                {!username && (
                    <li>
                        <Link href='/enter'>
                            <button className="btn-blue">Log in</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    )
}