import React, {useState, useEffect, useRef} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faThumbsUp, faComment, faEye, faEllipsisV} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useForm, usePage } from "@inertiajs/react";
import CreateComment from "@/Components/CreateComment.jsx";
import CommentList from "@/Components/CommentList.jsx";
import Dropdown from "@/Components/Dropdown.jsx";
import InputError from "@/Components/InputError.jsx";
import TextInput from "@/Components/TextInput.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";

dayjs.extend(relativeTime);

export default function CardPub({ publication, user }) {
    const [liked, setLiked] = useState(false);
    const [likedComments, setLikedComments] = useState({});
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [editing, setEditing] = useState(false);
    const fileInputRef = useRef(null);

    // const { post, reset } = useForm();
    const { auth } = usePage().props;
    const isAuthor = auth.user.id === publication.user.id;
    const { data, setData, patch, clearErrors, reset, errors, post } = useForm({
        content: publication.content,
        image: publication.image,
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

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("content", data.content);
        if (data.image) {
            formData.append("image", data.image);
        }
        post(route("publications.update", publication.id), {
            method: "patch",
            onSuccess: () => {
                setEditing(false);
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
                {isAuthor && (
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="text-gray-500">
                                <FontAwesomeIcon icon={faEllipsisV} />
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                            <button className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 transition duration-150 ease-in-out" onClick={() => setEditing(true)}>
                                Edit
                            </button>
                            <Dropdown.Link as="button" href={route("publications.destroy", publication.id)} method="delete">
                                Delete
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                )}
            </div>

            {editing ? (
                <form onSubmit={submit}>
                    <textarea value={data.content} onChange={(e) => setData("content", e.target.value)} className="mt-4 w-full text-gray-900 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"></textarea>
                    <InputError content={errors.content} className="mt-2" />
                    <TextInput label='Imagen' type='file' name='image' id='image' ref={fileInputRef}
                               onChange={(e) => setData('image', e.target.files[0])} />
                    <div className="space-x-2 mt-4">
                        <PrimaryButton>Save</PrimaryButton>
                        <button onClick={() => { setEditing(false); reset(); clearErrors(); }}>Cancel</button>
                    </div>
                </form>
            ) : (
                <>
                    {publication.image && (
                        <img className="rounded-lg object-cover"
                             src={publication.image.startsWith("http") ? publication.image : `/storage/${publication.image}`}
                             alt="Publication Image"/>
                    )}
                    <p className="mt-4 text-gray-900">{publication.content}</p>
                </>
            )}

             <div className="flex justify-between items-center mt-4">
                <button className="flex"
                        onClick={(e) => liked ? handleUnlike(publication.id, e) : handleLike(publication.id, e)}>
                    <FontAwesomeIcon icon={faThumbsUp} className="mr-2"/>
                    {liked ? 'Unlike' : 'Like'} {publication.likes.length}
                </button>

                <button className="flex" onClick={toggleCommentForm}>
                    <FontAwesomeIcon icon={faComment} className="mr-2"/>
                    Comment
                </button>

                <button className="flex" onClick={toggleComments}>
                    <FontAwesomeIcon icon={faEye} className="mr-2"/>
                    Ver comentarios
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
        </div>
    );
}
