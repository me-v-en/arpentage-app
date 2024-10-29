"use client"
import { useState } from "react";
import styles from "./scan.module.scss";

import { Html5QrcodeResult, Html5QrcodeScanner } from "html5-qrcode";

import { books_v1 } from 'googleapis';
import { useEffect } from "react";
import { Html5QrcodeError } from "html5-qrcode/esm/core";



export default function ScanBook() {

    const [scannedIsbn, setScannedIsbn] = useState<String>("Test");
    const [correspondingBooks, setCorrespondingBooks] = useState<books_v1.Schema$Volume[]>([]);

    const fetchBookInfosFromIsbn = async (isbn: string) => {
        const res = await fetch("https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn);
        if (!res.ok) {
            throw new Error(`Respon
se status: ${res.status}`);
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
    const onScanSuccess = (decodedText: String, decodedResult: Html5QrcodeResult) => {
        setScannedIsbn(decodedText);
    }

    const onScanFailure = (errorMessage: String, error: Html5QrcodeError) => {

        // handle scan failure, usually better to ignore and keep scanning.
        // for example:
        console.warn(`Code scan error = ${errorMessage}`);
    }

    useEffect(() => {
        // when component mounts
        const verbose = true;
        // Suceess callback is required.

        const html5QrcodeScanner = new Html5QrcodeScanner("reader", {
            fps: 10, qrbox: { width: 250, height: 250 }, disableFlip: false, useBarCodeDetectorIfSupported: true, experimentalFeatures: {
                useBarCodeDetectorIfSupported: true
            },
        }, verbose);
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);

        // cleanup function when component will unmount
        return () => {
            html5QrcodeScanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        };
    }, []);

    return (<>
        <div id="reader" className={styles.scanner}></div>
        <p>{scannedIsbn}</p>
    </>
    )
}