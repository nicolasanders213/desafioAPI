import Form from "./form";
import React from "react";

export default async function Login(){
    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
             style={{
                backgroundImage: `url('/images/banco.jpg')`, 
                fontFamily: 'Inter, sans-serif',
             }}>

            <div className="bg-gradient-to-b from-green-500 to-white h-screen w-fit sm:absolute right-8 top-0 flex items-center px-10 rounded-md shadow-2xl z-10">
                <Form />
            </div>
        </div>
    )
}