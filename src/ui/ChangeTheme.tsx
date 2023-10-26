import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

const localStorage = (): Storage | null => {
    if (typeof window === 'undefined') return null
    return window.localStorage
}

const ChangeTheme = () => {
    const [theme, setTheme] = useState(localStorage()?.getItem("theme"));
    const [mount, setMount] = useState(false);
    const handleClick = () => {
        setTimeout(() => setTheme(theme === "light" ? "dark" : "light"), 100)
    };

    useEffect(() => {
        setMount(true);
    }, [])

    useEffect(() => {
        if (!theme) {
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                setTheme("dark")
            }
            else setTheme("light")
        }
        if (theme === "dark") {
            window.document.documentElement.setAttribute("class", "dark");
            window.document.documentElement.setAttribute("data-mode", "dark");
        } else {
            window.document.documentElement.setAttribute("class", "light");
            window.document.documentElement.setAttribute("data-mode", "light");
        }
        localStorage()?.setItem("theme", theme!);
    }, [theme]);
    return (
        <div className="fixed z-50 bottom-5 right-5">
            {theme === "light" && mount ? (
                <MoonIcon
                    className="w-10 cursor-pointer rounded-full bg-black p-1 text-yellow-500"
                    onClick={handleClick}
                />
            ) : (
                <SunIcon
                    className="w-10 cursor-pointer rounded-full bg-white p-1 text-yellow-500"
                    onClick={handleClick}
                />
            )

            }
        </div>
    )
};

export default ChangeTheme