import { Button } from "@mui/material";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <Link href="/book/scan">
                <Button>
                    Scanner un livre
                </Button>
            </Link>
            <Link href="/book/search">
                <Button>
                    Chercher un livre
                </Button>
            </Link>
        </>
    );
}
