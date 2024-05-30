import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faComment, faEye, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link, useForm, usePage } from "@inertiajs/react";
import CreateComment from "@/Components/CreateComment.jsx";
import CommentList from "@/Components/CommentList.jsx";
import Dropdown from "@/Components/Dropdown.jsx";
import InputError from "@/Components/InputError.jsx";
import TextInput from "@/Components/TextInput.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import Avatar from "@mui/material/Avatar";
import CreatePublicationDialog from "@/Components/CreatePublicationDialog.jsx";

dayjs.extend(relativeTime);

export default function CardPub({ publication }) {
    const [liked, setLiked] = useState(false);
    const [likedComments, setLikedComments] = useState({});
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [editing, setEditing] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const fileInputRef = useRef(null);

    const { auth } = usePage().props;
    const isAuthor = auth.user.id === publication.user.id;
    const { data, setData, patch, clearErrors, reset, errors, post, put } = useForm({
        content: '',
    });

    useEffect(() => {
        setLiked(publication.likes.some(like => like.id === auth.user.id));
        const initialLikedComments = {};
        publication.comments.forEach(comment => {
            initialLikedComments[comment.id] = comment.likes.some(like => like.user_id === auth.user.id);
        });
        setLikedComments(initialLikedComments);
    }, [publication.likes, publication.comments, auth.user.id]);

    const handleLike = (publicationId, e) => {
        e.preventDefault();
        post(route("publications.like", publicationId), {
            onSuccess: () => {
                setLiked(true);
                reset();
            },
            preserveScroll: true,
        });
    };

    const handleUnlike = (publicationId, e) => {
        e.preventDefault();
        post(route("publications.unlike", publicationId), {
            onSuccess: () => {
                setLiked(false);
                reset();
            },
            preserveScroll: true,
        });
    };

    const handleLikeComment = (commentId, e) => {
        e.preventDefault();
        post(route("comments.like", commentId), {
            onSuccess: () => {
                setLikedComments(prev => ({ ...prev, [commentId]: true }));
                // Actualiza el estado del comentario con el nuevo like
                const updatedComments = publication.comments.map(comment => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            likes: [...comment.likes, { user_id: auth.user.id }],
                        };
                    }
                    return comment;
                });
                publication.comments = updatedComments;
                reset();
            },
            preserveScroll: true,
        });
    };

    const handleUnlikeComment = (commentId, e) => {
        e.preventDefault();
        post(route("comments.unlike", commentId), {
            onSuccess: () => {
                setLikedComments(prev => ({ ...prev, [commentId]: false }));
                // Actualiza el estado del comentario quitando el like
                const updatedComments = publication.comments.map(comment => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            likes: comment.likes.filter(like => like.user_id !== auth.user.id),
                        };
                    }
                    return comment;
                });
                publication.comments = updatedComments;
                reset();
            },
            preserveScroll: true,
        });
    };

    const toggleCommentForm = () => {
        setShowCommentForm(!showCommentForm);
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const handleOpenEditDialog = () => {
        setEditing(true);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setEditing(false);
        setOpenEditDialog(false);
    };

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("content", data.content);
        if (data.image instanceof File) {
            formData.append("image", data.image);
        }

        post(route("publications.update", publication.id), {
            method: "put",
            data: formData,
            onSuccess: () => {
                setEditing(false);
                setOpenEditDialog(false);
            },
            onError: () => {
                console.error(errors);
            },
            preserveScroll: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    };

    return (
        <div className="max-w-6xl bg-white border border-gray-200 rounded-lg shadow p-6 flex flex-col space-y-4">
            <div className="flex justify-between items-center">
                <Link href={route('profile', { name: publication.user.name })}>
                    <div className="flex items-center space-x-4">
                        <Avatar
                            alt={`${publication.user.name} Avatar`}
                            src={publication.user.avatar ? `/storage/${publication.user.avatar}` : "/img/avatar_default.jpg"}
                            sx={{ width: 56, height: 56 }}
                        />
                        <div>
                            <h5 className="text-sm font-bold">{publication.user.name}</h5>
                            <small className="ml-2 text-sm text-gray-600">{dayjs(publication.created_at).fromNow()}</small>
                        </div>
                    </div>
                </Link>
                {isAuthor && (
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="text-gray-500">
                                <FontAwesomeIcon icon={faEllipsisV} />
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                            <button
                                className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 transition duration-150 ease-in-out"
                                onClick={handleOpenEditDialog}>
                                Edit
                            </button>
                            <Dropdown.Link as="button" href={route("publications.destroy", publication.id)}
                                           method="delete">
                                Delete
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                )}
            </div>

            {publication.image && !editing && (
                <img className="rounded-lg object-cover"
                     src={publication.image.startsWith("http") ? publication.image : `/storage/${publication.image}`}
                     alt="Publication Image" />
            )}
            <p className="mt-4 text-gray-900">{publication.content}</p>

            <div className="flex justify-between items-center mt-4 space-x-2 sm:space-x-4">
                <button className="flex items-center"
                        onClick={(e) => liked ? handleUnlike(publication.id, e) : handleLike(publication.id, e)}>
                    <FontAwesomeIcon icon={faThumbsUp} className="mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">{liked ? 'Unlike' : 'Like'} {publication.likes.length}</span>
                </button>

                <button className="flex items-center" onClick={toggleCommentForm}>
                    <FontAwesomeIcon icon={faComment} className="mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">Comment</span>
                </button>

                <button className="flex items-center" onClick={toggleComments}>
                    <FontAwesomeIcon icon={faEye} className="mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">Ver comentarios</span>
                </button>
            </div>

            {showCommentForm && (
                <CreateComment publication={publication} setShowCommentForm={setShowCommentForm} />
            )}
            {showComments && (
                <CommentList
                    comments={publication.comments}
                    likedComments={likedComments}
                    handleLikeComment={handleLikeComment}
                    handleUnlikeComment={handleUnlikeComment}
                />
            )}

            <CreatePublicationDialog
                open={openEditDialog}
                handleClose={handleCloseEditDialog}
                submit={submit}
                data={data}
                setData={setData}
                errors={errors}
                fileInputRef={fileInputRef}
                processing={false} // Adjust as needed
                isEdit={true}
            />
        </div>
    );
}
