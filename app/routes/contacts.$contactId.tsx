import { Form, json, useFetcher, useLoaderData } from "@remix-run/react";
import type { FunctionComponent } from "react";

import { getContact, type ContactRecord, updateContact } from "../data";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    invariant(params.contactId, "Missing contactId param");
    const contact = await getContact(params.contactId);
    if (!contact) {
        throw new Response("Not Found", { status: 404 });
    }
    console.log("contact");
    return json({ contact });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
    invariant(params.contactId, "Missing contactId param");
    const formData = await request.formData();
    const favorite = formData.get("favorite");
    return updateContact(params.contactId, { favorite: favorite === "true" });
};

export default function Contact() {
    // const contact = {
    //   first: "Your",
    //   last: "Name",
    //   avatar: "https://placekitten.com/g/200/200",
    //   twitter: "your_handle",
    //   notes: "Some notes",
    //   favorite: true,
    // };
    const { contact } = useLoaderData<typeof loader>();

    return (
        <div id="contact">
            <div>
                <img
                    alt={`${contact.first} ${contact.last} avatar`}
                    key={contact.avatar}
                    src={contact.avatar}
                />
            </div>

            <div>
                <h1>
                    {contact.first || contact.last ? (
                        <>
                            {contact.first} {contact.last}
                        </>
                    ) : (
                        <i>No Name</i>
                    )}{" "}
                    <Favorite contact={contact} />
                </h1>

                {contact.twitter ? (
                    <p>
                        <a href={`https://twitter.com/${contact.twitter}`}>
                            {contact.twitter}
                        </a>
                    </p>
                ) : null}

                {contact.notes ? <p>{contact.notes}</p> : null}

                <div>
                    <Form action="edit">
                        <button type="submit">Edit</button>
                    </Form>

                    <Form
                        action="destory"
                        method="post"
                        onSubmit={(event) => {
                            const response = confirm(
                                "Please confirm you want to delete this record."
                            );
                            if (!response) {
                                event.preventDefault();
                            }
                        }}
                    >
                        <button type="submit">Delete</button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

const Favorite: FunctionComponent<{
    contact: Pick<ContactRecord, "favorite">;
}> = ({ contact }) => {
    const fetcher = useFetcher();
    const favorite = fetcher.formData
        ? fetcher.formData.get("favorite") === "true"
        : contact.favorite;
    console.log("formData", fetcher.formData?.get("favorite"));
    console.log("state", fetcher.state);

    return (
        <fetcher.Form method="post">
            <button
                aria-label={
                    favorite ? "Remove from favirtes" : "Add to favorite"
                }
                name="favorite"
                value={favorite ? "false" : "true"}
            >
                {favorite ? "★" : "☆"}
            </button>
            {fetcher.state}
        </fetcher.Form>
    );
};
