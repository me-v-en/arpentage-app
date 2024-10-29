"use client"
import { useState } from "react";
import styles from "./search.module.scss";

import { books_v1 } from 'googleapis';
import { List, ListItemAvatar, ListItem, ListItemText, Stack, TextField, Button } from "@mui/material";



interface BookListItemProps {
    book: books_v1.Schema$Volume,
    handleAddBook: Function
}

interface BooksListItemsProps {
    books: books_v1.Schema$Volume[],
    handleAddBook: Function
}

const BookListItem = ({ book, handleAddBook }: BookListItemProps) => {
    const onAddBook = () => {
        handleAddBook(book);
    }


    const authorsList = book?.volumeInfo?.authors?.join(', ');

    return <ListItem className={styles.bookItem}>
        <ListItemAvatar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true">
            <img className={styles.bookThumbnail} src={book?.volumeInfo?.imageLinks?.smallThumbnail} alt="" />
        </ListItemAvatar>
        <ListItemText className={styles.bookDescription} primary={book?.volumeInfo?.title} secondary={authorsList}></ListItemText>
        <Button onClick={onAddBook}>
            Ajouter ce livre
        </Button>
    </ListItem>
}

const BooksListItems = ({ books, handleAddBook }: BooksListItemsProps) => {
    return books.map((book) => (<BookListItem key={book.id} book={book} handleAddBook={handleAddBook}></BookListItem>))
}




export default function SearchBook() {
    const [searchResult, setSearchResult] = useState<books_v1.Schema$Volume[]>([]);


    const fetchBookSearchResult = async (search: string) => {
        const res = await fetch("https://www.googleapis.com/books/v1/volumes?q=" + search);
        if (!res.ok) {
            throw new Error(`Response status: ${res.status}`);
        }

        const data = await res.json();
        return data.items;
    }

    const handleSearchSubmit = async (e: any) => {
        e.stopPropagation();
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        const search = String(formData.get("search"));

        const books = await fetchBookSearchResult(search);

        setSearchResult(books);
    }

    const handleAddBook = (book: books_v1.Schema$Volume) => {
        console.log("add", book);
    }


    return (<>

        <form onSubmit={handleSearchSubmit} className={styles.formRow}>
            <TextField className={styles.field} id="search" name="search" label="Titre, auteurs..." type="text" />
            <Button variant="contained" type="submit">Chercher</Button>
        </form>
        {
            searchResult && searchResult.length > 0 ? (< List className={styles.bookList}>
                {BooksListItems({ books: searchResult, handleAddBook })}
            </List >) : null
        }
    </>
    )
}