import React, { useEffect, useState } from "react";
import Dropdown from "@/Components/Dropdown";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm, usePage } from "@inertiajs/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import DangerButton from "./DangerButton";

dayjs.extend(relativeTime);

export default function Publication({ publication, followers }) {
    const { auth } = usePage().props;
    const [editing, setEditing] = useState(false);
    const [liked, setLiked] = useState(publication.liked);
    const [followed, setFollowed] = useState(publication.followed);

    const likedPublications = usePage().props.likePublications;
    const followUser = usePage().props.followers;
    const isFollowing = followUser.includes(publication.user.id);
    const { data, setData, patch, clearErrors, reset, errors, post } = useForm({
        content: publication.content,
    });

    const handleLike = (publicationId, e) => {
        e.preventDefault();
        post(route("publications.like", publicationId), {
            onSuccess: () => {
                setLiked(true);
                console.log('like', liked);
                console.log("Like publications", likedPublications);
                reset();
            },
            preserveScroll: true,
        });
    };

    const handleUnlike = (publicationId, e) => {
        post(route("publications.unlike", publicationId), {
            onSuccess: () => {
                setLiked(false);
                console.log('unlike', liked);
                reset();
            },
            preserveScroll: true,
        });
    };
    const handleFollow = (userId) => {
        post(route("user.follow", userId), {
            onSuccess: () => {
                setFollowed(true);
                console.log('follow', followed);
                console.log('follow followUser', followUser);
                reset();

            },

            preserveScroll: true,
        });
    };

    const handleUnfollow = (userId) => {
        post(route("user.unfollow", userId), {
            onSuccess: () => {
                setFollowed(false);
                console.log('unfollow', followed);
                reset();

            },
            preserveScroll: true,
        });
    };

    const submit = (e) => {
        e.preventDefault();
        patch(route("publications.update", publication.id), {
            onSuccess: () => setEditing(false),
        });
    };

    useEffect(() => {
        const isFollow = followUser.includes(publication.user.id);
        const isLiked = likedPublications.includes(publication.id);

        setLiked(isLiked);
        // setFollowed(isFollow);
        setFollowed(isFollowing);
        console.log("followerssssssssss", followers);
    }, []);

    return (
        <div className="p-6 flex space-x-2">
            {/* SVG icono de conversación */}

            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-gray-800">
                            {publication.user.name}
                        </span>
                        <small className="ml-2 text-sm text-gray-600">
                            {dayjs(publication.created_at).fromNow()}
                        </small>
                        {publication.created_at !== publication.updated_at && (
                            <small className="text-sm text-gray-600">
                                {" "}
                                &middot; edited

                            </small>
                        )}
                        {followed ? (
                            <DangerButton
                                onClick={(e) =>
                                    handleUnfollow(publication.user.id)
                                }
                            >

                                Unfollow{" "}
                            </DangerButton>
                        ) : (
                            <DangerButton
                                onClick={(e) =>
                                    handleFollow(publication.user.id)
                                }
                            >
                                Follow
                            </DangerButton>
                        )}
                    </div>
                    {publication.user.id === auth.user.id && (
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button>{/* Icono de opciones */}...</button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <button
                                    className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 transition duration-150 ease-in-out"
                                    onClick={() => setEditing(true)}
                                >
                                    Edit
                                </button>
                                <Dropdown.Link
                                    as="button"
                                    href={route(
                                        "publications.destroy",
                                        publication.id
                                    )}
                                    method="delete"
                                >
                                    Delete
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    )}
                </div>

                {editing ? (
                    <form onSubmit={submit}>
                        <textarea
                            value={data.content}
                            onChange={(e) => setData("content", e.target.value)}
                            className="mt-4 w-full text-gray-900 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                        ></textarea>
                        <InputError content={errors.content} className="mt-2" />
                        <div className="space-x-2">
                            <PrimaryButton className="mt-4">Save</PrimaryButton>
                            <button
                                className="mt-4"
                                onClick={() => {
                                    setEditing(false);
                                    reset();
                                    clearErrors();
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        {publication.image.startsWith("http") ? (
                            <img
                                className="rounded-3xl"
                                src={publication.image}
                                alt=""
                            />
                        ) : (
                            <img
                                className="rounded-3xl"
                                src={`/storage/${publication.image}`}
                                alt=""
                            />
                        )}
                        <p className="mt-4 text-lg text-gray-900">
                            {publication.content}
                        </p>
                        

                            {liked ? (
                                <PrimaryButton
                                onClick={(e) => handleUnlike(publication.id, e)}
                                >
                                    Unlike
                                </PrimaryButton>
                            ) : (
                                <PrimaryButton
                                onClick={(e) => handleLike(publication.id, e)}
                                >
                                    Like
                                </PrimaryButton>
                            )}
             
                            <p>Likes: {publication.likes}</p>
                   
                     
                    </>
                )}
            </div>
        </div>
    );
}
