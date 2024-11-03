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
        const scannedBarcode = barcode?.codeResult?.code;
        console.log(scannedBarcode);
        setScannedIsbn(scannedBarcode);
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
                frequency : 25,
                locator: {
                    halfSample: true,
                    patchSize: "medium", // x-small, small, medium, large, x-large
                    debug: {
                        showCanvas: true,
                        showPatches: false,
                        showFoundPatches: false,
                        showSkeleton: false,
                        showLabels: false,
                        showPatchLabels: false,
                        showRemainingPatchLabels: false,
                        boxFromPatches: {
                            showTransformed: true,
                            showTransformedBox: true,
                            showBB: true,
                        },
                    },
                },
                numOfWorkers: window.navigator.hardwareConcurrency,
                decoder: {
                    readers: ['ean_reader'],
                    debug: {
                        drawBoundingBox: true,
                        showFrequency: true,
                        drawScanline: true,
                        showPattern: true,
                    },
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