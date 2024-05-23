import React, {useEffect, useRef} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";

import { useForm, Head } from "@inertiajs/react";
import Publication from "../../Components/Publication";
import CardPub from "@/Components/CardPub.jsx";

export default function Index({ auth, user, isCurrentUserFollower, followerCount, publications }) {
    const fileInputRef = useRef(null);
    const { data, setData, post, processing, reset, errors } = useForm({
        content: "",
        image: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("publications.store"), { onSuccess: () => reset() });
        setData({
            content: '',
            image: '',
          });
    };

    useEffect(() => {
        console.log("My Pubs:", publications);
    }, [publications]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Publication" />

            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <form onSubmit={submit}>
                    <textarea
                        value={data.content}
                        placeholder="What's on your mind?"
                        className="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                        onChange={(e) => setData("content", e.target.value)}
                    ></textarea>
                    <InputError content={errors.content} className="mt-2" />
                    <TextInput label='Imagen' type='file' name='image' id='image' ref={fileInputRef}
            onChange={(e) => setData('image', e.target.files[0])} />

                    <PrimaryButton className="mt-4" disabled={processing}>
                        Publicar
                    </PrimaryButton>
                </form>
                <div className="mt-6 bg-white shadow-sm rounded-lg divide-y">
                    {publications.map((publication) => (
                        <CardPub publication={publication} key={publication.id} user={user}/>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
