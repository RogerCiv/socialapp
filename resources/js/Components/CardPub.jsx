import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faComment, faShare } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {useForm} from "@inertiajs/react";

dayjs.extend(relativeTime);

export default function CardPub({ publication }) {
    const [liked, setLiked] = useState(false);
    const { post,reset } = useForm();
    const handleLike = (publicationId, e) => {
        e.preventDefault(); // Asegúrate de que e esté definido correctamente
        post(route("publications.like", publicationId), {
            onSuccess: () => {
                setLiked(true);
                reset();
            },
            preserveScroll: true,
        });
    };


    const handleUnlike = (publicationId, e) => {
        post(route("publications.unlike", publicationId), {
            onSuccess: () => {
                setLiked(false);
                reset();
            },
            preserveScroll: true,
        });
    };

    return (
        <div className="max-w-6xl bg-white border border-gray-200 rounded-lg shadow p-6 flex flex-col space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <img className="rounded-full w-12 h-12" src={publication.user.avatar} alt={publication.user.name} />
                    <div>
                        <h5 className="text-sm font-bold">{publication.user.name}</h5>
                        <small className="ml-2 text-sm text-gray-600">{dayjs(publication.created_at).fromNow()}</small>
                    </div>
                </div>
            </div>

            {publication.image && (
                // <img className="rounded-lg object-cover" src={`/storage/${publication.image}`} alt="Publication Image" />
                <img className="rounded-lg object-cover"
                     src={publication.image.startsWith("http") ? publication.image : `/storage/${publication.image}`}
                     alt="Publication Image"/>

            )}

            <p className="mt-4 text-gray-900">{publication.content}</p>

            <div className="flex justify-between items-center mt-4">
                <button className="flex"
                        onClick={(e) => liked ? handleUnlike(publication.id, e) : handleLike(publication.id, e)}>
                    <FontAwesomeIcon icon={faThumbsUp} className="mr-2"/>
                    {liked ? 'Unlike' : 'Like'}
                </button>


                <button className="flex">
                    <FontAwesomeIcon icon={faComment} className="mr-2"/>
                    Comment
                </button>

                <button className="flex">
                    <FontAwesomeIcon icon={faShare} className="mr-2"/>
                    Share
                </button>
            </div>
        </div>
    );
}
