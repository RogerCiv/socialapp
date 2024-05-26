import React, {useEffect, useRef, useState} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";

import { useForm, Head } from "@inertiajs/react";
import Publication from "../../Components/Publication";
import CardPub from "@/Components/CardPub.jsx";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "@/Components/TabPanel.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";

export default function Index({ auth, user, publications,publicationsForUser,top3Pub, top3Comments,top3LikedPublications }) {
    const fileInputRef = useRef(null);
    const { data, setData, post, processing, reset, errors } = useForm({
        content: "",
        image: "",
    });
    const crownColors = ["text-yellow-500", "text-slate-500", "text-[#bf8970] "];

    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    useEffect(() => {
        console.log(publicationsForUser);
    }, []);
    const submit = (e) => {
        e.preventDefault();
        console.log(data);
        post(route("publications.store"), { onSuccess: () => reset() });
        setData({
            content: '',
            image: '',
          });

    };

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
                    <InputError content={errors.content} className="mt-2"/>
                    <TextInput label='Imagen' type='file' name='image' id='image' ref={fileInputRef}
                               onChange={(e) => setData('image', e.target.files[0])}/>

                    <PrimaryButton className="mt-4" disabled={processing}>
                        Publicar
                    </PrimaryButton>
                </form>
                <div className="flex items-center space-x-4">
                    <Box sx={{width: "100%", bgcolor: "background.paper", borderRadius: 1}} p={2}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            centered
                            variant="fullWidth"
                        >
                            <Tab label="All"/>
                            <Tab label="Trend"/>
                            <Tab label="Stats"/>
                        </Tabs>
                    </Box>
                </div>
                <div className="mt-6 bg-white shadow-sm rounded-lg divide-y">
                    <TabPanel value={value} index={0}>
                    {publications.map((publication) => (
                        <CardPub publication={publication} key={publication.id} user={user}/>
                    ))}
                    </TabPanel>
                </div>
                <TabPanel value={value} index={1}>
                    <div className="space-y-8 flex flex-col">
                        {publicationsForUser.map((publication) => (
                            <CardPub publication={publication} key={publication.id} user={user}/>
                        ))}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <div className="col-span-4">
                        <h2 className="text-2xl font-bold mb-4">Top 3 Usuarios con Más Publicaciones</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {top3Pub.map((user, index) => (
                                <div key={user.user_id}
                                     className={`relative rounded-lg overflow-hidden ${index === 0 ? 'bg-gold' : index === 1 ? 'bg-silver' : 'bg-bronze'}`}>
                                    <div className="p-4">
                                        <div className="relative">
                                            <img
                                                className="rounded-full w-24 h-24 mx-auto"
                                                src={user.user.avatar}
                                                alt=""
                                            />
                                            <FontAwesomeIcon
                                                icon={faCrown}
                                                className={`absolute -top-2 right-0 h-8 w-8 ${crownColors[index]}`}
                                                title={`Crown ${index + 1}`}
                                            />
                                        </div>
                                        <h5 className="text-lg font-bold mt-2 text-center">{user.user.name}</h5>
                                        <p className="text-gray-700 text-center">Publicaciones: {user.publications_count}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <h2 className="text-2xl font-bold mt-8 mb-4">Top 3 Usuarios con Más Comentarios</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {top3Comments.map((comment, index) => (
                                <div key={comment.user_id}
                                     className={`relative rounded-lg overflow-hidden ${index === 0 ? 'bg-gold' : index === 1 ? 'bg-silver' : 'bg-bronze'}`}>
                                    <div className="p-4">
                                        <div className="relative">
                                            <img
                                                className="rounded-full w-24 h-24 mx-auto"
                                                src={comment.user.avatar}
                                                alt=""
                                            />
                                            <FontAwesomeIcon
                                                icon={faCrown}
                                                className={`absolute -top-2 right-0 h-8 w-8 ${crownColors[index]}`}
                                                title={`Crown ${index + 1}`}
                                            />
                                        </div>
                                        <h5 className="text-lg font-bold mt-2 text-center">{comment.user.name}</h5>
                                        <p className="text-gray-700 text-center">Comentarios: {comment.comments_count}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="col-span-4">
                            <h2 className="text-2xl font-bold mb-4">Top 3 Publicaciones más Gustadas</h2>
                            <div className="grid grid-cols-3 gap-4">
                                {top3LikedPublications.map((likedPublication, index) => (
                                    <div key={likedPublication.publication.id}
                                         className={`relative rounded-lg overflow-hidden ${index === 0 ? 'bg-gold' : index === 1 ? 'bg-silver' : 'bg-bronze'}`}>
                                        <div className="p-4">
                                            <div className="relative">
                                                <img
                                                    className="rounded-full w-24 h-24 mx-auto"
                                                    src={likedPublication.publication.user.avatar}
                                                    alt=""
                                                />
                                                <FontAwesomeIcon
                                                    icon={faCrown}
                                                    className={`absolute -top-2 right-0 h-8 w-8 ${crownColors[index]}`}
                                                    title={`Crown ${index + 1}`}
                                                />
                                            </div>
                                            <h5 className="text-lg font-bold mt-2 text-center">{likedPublication.publication.user.name}</h5>
                                            <p className="text-gray-700 text-center">Publicación #{index + 1}</p>
                                            <p className="text-gray-700 text-center">Likes: {likedPublication.likes_count}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </TabPanel>


            </div>
        </AuthenticatedLayout>
    );
}
