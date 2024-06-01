import React, { useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import Avatar from "@mui/material/Avatar";

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);


    return (
        <div className="min-h-screen bg-background-50 ">
            <nav className="border-b border-accent-600 bg-background-50 p-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {/*<NavLink*/}
                                {/*    href={route("dashboard")}*/}
                                {/*    active={route().current("dashboard")}*/}
                                {/*>*/}
                                {/*    Dashboard*/}
                                {/*</NavLink>*/}
                                {/*<NavLink*/}
                                {/*    href={route("publications.index")}*/}
                                {/*    active={route().current("publications.index")}*/}
                                {/*>*/}
                                {/*    Publications*/}
                                {/*</NavLink>*/}


                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-6 ">
                            <div className="ms-3 relative ">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md ">

                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                       <Avatar
                                                           alt={`${user.name} Avatar`}
                                                           src={user.avatar ? `/storage/${user.avatar}` : "/img/avatar_default.jpg"}
                                                       />
                                               <p className=' ml-2 font-semibold text-text-950'>{user.name}</p>

                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile",{user:user.name})}
                                        >
                                            Profile
                                        </Dropdown.Link>

                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Ajustes
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500
                                  transition duration-150 ease-in-out">
                                <svg
                                    className="h-6 w-6"
                                    stroke="#f38139"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="pt-2 pb-3 space-y-1">
                        {/*<ResponsiveNavLink*/}
                        {/*    href={route("dashboard")}*/}
                        {/*    active={route().current("dashboard")}*/}
                        {/*>*/}
                        {/*    Dashboard*/}
                        {/*</ResponsiveNavLink>*/}
                    </div>

                    <div className="pt-4 pb-1 border-t border-accent-600">
                        <div className="px-4 grid grid-cols-1 text-text-950">
                            <div className='flex gap-2 '>
                                    <Avatar
                                        alt={`${user.name} Avatar`}
                                        src={user.avatar ? `/storage/${user.avatar}` : "/img/avatar_default.jpg"}
                                        sx={{ width: 24, height: 24 }}
                                    />
                                {user.name}
                            </div>
                            <div className='text-text-700' >
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1  text-text-950">
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Ajustes
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
