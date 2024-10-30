"use client"
import { useState } from "react";
import styles from "./scan.module.scss";

import { books_v1 } from 'googleapis';
import { useEffect } from "react";

import Quagga from 'quagga';


export default function ScanBook() {
    console.log(Quagga);

    const [scannedIsbn, setScannedIsbn] = useState<String>("Test");
    const [correspondingBooks, setCorrespondingBooks] = useState<books_v1.Schema$Volume[]>([]);

    const fetchBookInfosFromIsbn = async (isbn: string) => {
        const res = await fetch("https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn);
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

        setCorrespondingBooks(books);
    }

    const handleDetectBarcode = (barcode: any) => {
        console.log(barcode?.codeResult.code);
        setScannedIsbn(barcode?.codeResult.code);
    }


    useEffect(() => {
        Quagga.init(
            {
                inputStream: {
                    type: 'LiveStream',
                    constraints: {
                        width: 640,
                        height: 320,
                        facingMode: 'environment',
                    },
                },
                locator: {
                    halfSample: true,
                    patchSize: "x-small", // x-small, small, medium, large, x-large
                },
                numOfWorkers: window.navigator.hardwareConcurrency,
                decoder: {
                    readers: ['code_128_reader'],
                },
                locate: true,
            },
            function (err: any) {
                if (err) {
                    return console.log(err)
                }
                Quagga.start()
            },
        )
        Quagga.onDetected(handleDetectBarcode);

        return () => {
            Quagga.offDetected(handleDetectBarcode);
        };
    }, []);

    return (<>
        <p>{scannedIsbn}</p>
        <div id="interactive" className="viewport"></div>
    </>
    )
}