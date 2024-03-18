import {
    Form,
    Link,
    Links,
    LiveReload,
    Meta,
    NavLink,
    Outlet,
    Scripts,
    ScrollRestoration,
    json,
    redirect,
    useLoaderData,
    useNavigation,
    useSubmit,
} from "@remix-run/react";

import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import appStylesHref from "./app.css";
import { createEmptyContact, getContacts } from "./data";
import { useEffect, useState } from "react";

export const action = async () => {
    const contact = await createEmptyContact();
    return redirect(`/contacts/${contact.id}/edit`);
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const q = searchParams.get("q");
    const contacts = await getContacts(q);
    return json({ contacts, q });
};

export default function App() {
    const { contacts, q } = useLoaderData<typeof loader>();
    const [query, setQuery] = useState(q || "");
    const navigation = useNavigation();
    const submit = useSubmit();
    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has("q");

    useEffect(() => {
        setQuery(q || "");
    }, [q]);

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                <div id="sidebar">
                    <h1>Remix Contacts</h1>
                    <div>
                        <Form
                            id="search-form"
                            role="search"
                            onChange={(event) => {
                                const isFirstSearch = q === null;
                                submit(event.currentTarget, {
                                    replace: !isFirstSearch,
                                });
                            }}
                        >
                            <input
                                id="q"
                                value={query || ""}
                                aria-label="Search contacts"
                                placeholder="Search"
                                type="search"
                                name="q"
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                className={searching ? "loading" : ""}
                            />
                            <div
                                id="search-spinner"
                                aria-hidden
                                hidden={!searching}
                            />
                        </Form>
                        <Form method="post">
                            <button type="submit">New</button>
                        </Form>
                    </div>
                    <nav>
                        {contacts.length ? (
                            <ul>
                                {contacts.map((contact) => (
                                    <li key={contact.id}>
                                        <NavLink
                                            to={`contacts/${contact.id}`}
                                            className={({
                                                isActive,
                                                isPending,
                                            }) =>
                                                isActive
                                                    ? "active"
                                                    : isPending
                                                    ? "pending"
                                                    : ""
                                            }
                                        >
                                            {contact.first || contact.last ? (
                                                <>
                                                    {contact.first}{" "}
                                                    {contact.last}
                                                </>
                                            ) : (
                                                <i>No Name</i>
                                            )}{" "}
                                            {contact.favorite ? (
                                                <span>★</span>
                                            ) : null}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>
                                <i>No Contacts</i>
                            </p>
                        )}
                        <ul>
                            <li>
                                <Link to={`/contacts/1`}>Your Name</Link>
                            </li>
                            <li>
                                <Link to={`/contacts/2`}>Your Friend</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div
                    className={
                        navigation.state === "loading" && !searching
                            ? "loading"
                            : ""
                    }
                    id="detail"
                >
                    <Outlet />
                </div>

                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: appStylesHref },
];
