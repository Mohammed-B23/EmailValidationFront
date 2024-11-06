import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import './App.css'; // Import the CSS file for styles
import logo from './logo.png'; // Assurez-vous que le chemin est correct pour votre logo

function App() {
    const [emails, setEmails] = useState([]);
    const [results, setResults] = useState([]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const extractedEmails = results.data
                        .map(row => row.emails)
                        .filter(email => email);

                    console.log("Emails after parsing: ", extractedEmails);
                    setEmails(extractedEmails);
                },
                error: (error) => {
                    console.error("Erreur lors du parsing du fichier CSV :", error);
                }
            });
        } else {
            console.error("Aucun fichier sélectionné.");
        }
    };
//http://localhost:8080/api/emails/validate
    const validateEmails = () => {
        console.log("emails are ready to sent: ", emails);
        axios.post('http://172.19.173.133/api/emails/validate', emails)
            .then(response => {
                console.log("results coming from API: ", response.data);
                setResults(response.data);
            })
            .catch(error => {
                console.error("Erreur lors de la validation des emails :", error);
            });
    };

    return (
        <div className="App">
            <img src={logo} alt="Logo Mb6" className="logo" />
            <h1>Email Validator</h1>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="file-input" />
            <button onClick={validateEmails} className="validate-button">Validate Emails</button>
            <div className="results">
                {results.map(result => (
                    <div key={result.email} className="result-item">
                        {result.email}: <strong>{result.status}</strong>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
