"use client"
import { useState } from "react";
import styles from "./search.module.scss";

import { books_v1 } from 'googleapis';
import { List, ListItemAvatar, ListItemButton, ListItemText, TextField } from "@mui/material";



interface BookListItemProps {
    book: books_v1.Schema$Volume

}
const BookListItem = ({ book }: BookListItemProps) => {
    return <ListItemButton>
        <ListItemAvatar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true">
            <img className={styles.bookThumbnail} src={book?.volumeInfo?.imageLinks?.smallThumbnail} alt="" />
        </ListItemAvatar>
        <ListItemText>{book?.volumeInfo?.title}</ListItemText>
    </ListItemButton>
}

const BooksListItems = (books: books_v1.Schema$Volume[]) => {
    return books.map((book) => (<BookListItem key={book.id} book={book}></BookListItem>))
}




export default function SearchBook() {

    const [searchIsbnList, setSearchIsbnList] = useState<books_v1.Schema$Volume[]>([]);
    const [searchBookList, setSearchBookList] = useState<books_v1.Schema$Volume[]>([]);

    const fetchBookInfosFromIsbn = async (isbn: string) => {
        const res = await fetch("https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn);
        if (!res.ok) {
            throw new Error(`Response status: ${res.status}`);
        }

        const data = await res.json();
        return data.items;
    }


    const fetchBookSearchResult = async (search: string) => {
        const res = await fetch("https://www.googleapis.com/books/v1/volumes?q=" + search);
        if (!res.ok) {
            throw new Error(`Response status: ${res.status}`);
        }

        const data = await res.json();
        return data.items;
    }


    const handleIsbnSubmit = async (e: any) => {
        e.stopPropagation();
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        const isbn = String(formData.get("isbn"));

        const books = await fetchBookInfosFromIsbn(isbn);

        console.log(books);

        setSearchIsbnList(books);
    }
    const handleSearchSubmit = async (e: any) => {
        e.stopPropagation();
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        const search = String(formData.get("search"));

        const books = await fetchBookSearchResult(search);

        setSearchBookList(books);
    }



    return (<>
        <form onSubmit={handleIsbnSubmit}>
            <TextField id="isbn" label="Numéro ISBN du livre" name="isbn" type="text" />
        </form>
        {
            searchIsbnList && searchIsbnList.length > 0 ? (< List >
                {BooksListItems(searchIsbnList)}
            </List >) : null
        }

        <form onSubmit={handleSearchSubmit}>
            <TextField id="search" name="search" label="Rechercher un livre par titre, auteur etc." type="text" />


        </form>
        {
            searchBookList && searchBookList.length > 0 ? (< List >
                {BooksListItems(searchBookList)}
            </List >) : null
        }
    </>
    )
}