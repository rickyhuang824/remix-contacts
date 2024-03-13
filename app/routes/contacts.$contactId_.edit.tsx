import { ActionFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { LoaderFunctionArgs, json, redirect } from "react-router";
import invariant from "tiny-invariant";
import { getContact, updateContact } from "~/data";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  console.log("edit");
  return json({ contact });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.contactId, "Missing ContactId");
  const formData = await request.formData();

  // const contact = {
  //   first: formData.get("first")?.toString(),
  //   last: formData.get("last")?.toString(),
  //   avatar: formData.get("avatar")?.toString(),
  //   twitter: formData.get("twitter")?.toString(),
  //   notes: formData.get("notes")?.toString(),
  // };

  // const updatedContact = await updateContact(params.contactId, contact);
  // if (!updateContact) {
  //   throw new Response("Not Found", { status: 404 });
  // }
  // return json({ updatedContact });
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
};

export default function EditContact() {
  const { contact } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Form key={contact.id} id="contact-form" method="post">
      <p>
        <span>Name</span>
        <input
          defaultValue={contact.first}
          aria-label="First name"
          name="first"
          type="text"
          placeholder="First"
        />
        <input
          defaultValue={contact.last}
          aria-label="Last name"
          name="last"
          type="text"
          placeholder="Large"
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          defaultValue={contact.twitter}
          aria-label="twitter"
          name="twitter"
          type="text"
          placeholder="@jack"
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          defaultValue={contact.twitter}
          aria-label="Avatar URL"
          name="avatar"
          type="text"
          placeholder="https://example.com/avatar.jpg"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea defaultValue={contact.notes} name="notes" rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button onClick={() => navigate(-1)} type="button">
          Cancel
        </button>
      </p>
    </Form>
  );
}
