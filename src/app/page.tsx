import { Button } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Link href="/book/add">
        <Button>
          Ajouter un livre
        </Button>
      </Link>
    </main>
  );
}
