import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { deleteContact } from "~/data";

export const loader = async () => {
    console.log("here");
    return json({});
};

export const action = async ({ params }: ActionFunctionArgs) => {
    invariant(params.contactId, "Missing Contact Id");
    await deleteContact(params.contactId);
    return redirect(`/`);
};

export default function DestoryContact() {
    useLoaderData();
}
