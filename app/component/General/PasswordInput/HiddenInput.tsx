"use client"
import React from "react";
import { Input } from "@nextui-org/react";
import { EyeFilledIcon } from "./EyeFilledIcon";
import { EyeSlashFilledIcon } from "./EyeShashFilledIcon";

export default function App({ label, name, placeholder }: { label: string, name: string, placeholder: string }) {
    const [isVisible, setIsVisible] = React.useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <Input
            label={label}
            variant="bordered"
            placeholder={placeholder}
            endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                    {isVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                </button>
            }
            type={isVisible ? "text" : "password"}
            name={name}
            id={name}
            className="w-full text-black mb-4"
            required
        />
    );
}
