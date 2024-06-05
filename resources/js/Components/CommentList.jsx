import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import { useForm, usePage,Link } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";
import TextInput from "./TextInput";
import {faHeart} from "@fortawesome/free-solid-svg-icons";
import {faHeart as faHeartRegular} from "@fortawesome/free-regular-svg-icons";
import Avatar from "@mui/material/Avatar";
import CreateCommentReply from "@/Components/CreateCommentReply.jsx";

const CommentList = ({ comments, handleLikeComment, handleUnlikeComment }) => {
    const { auth } = usePage().props;
    const [editingCommentId, setEditingCommentId] = useState(null);
    const { data, setData, post, reset, clearErrors, errors } = useForm({ content: "" });
    const fileInputRef = useRef(null);

    const [replyingCommentId, setReplyingCommentId] = useState(null); // Estado para manejar respuestas

    const submit = (commentId, e) => {
        e.preventDefault();
        post(route("comments.update", commentId), {
            method: "patch",
            onSuccess: () => {
                setEditingCommentId(null);
                reset();
            },
            preserveScroll: true,
        });
    };

    const startEditing = (comment) => {
        setData("content", comment.content);
        setEditingCommentId(comment.id);
    };

    const cancelEditing = () => {
        setEditingCommentId(null);
        reset();
        clearErrors();
    };

    const handleReply = (commentId) => {
        setReplyingCommentId(commentId);
    };

    const cancelReplying = () => {
        setReplyingCommentId(null);
    };

    useEffect(() => {
        console.log(comments.map(comment => comment.likes));
    }, []);

    // Función para renderizar los comentarios de forma recursiva
    const renderComments = (comments) => {
        return comments.map(comment => {
            const isLiked = comment.likes.some(like => like.id === auth.user.id);
            return (
                <div key={comment.id} className="border-t border-accent-400 pt-4 flex flex-col space-y-4 mb-2">
                    <div className="flex items-start space-x-4">
                        <Link href={route('profile', { name: comment.user.name })}>
                            <Avatar
                                alt={`${comment.user.name} Avatar`}
                                src={comment.user.avatar ? `/storage/${comment.user.avatar}` : "/img/avatar_default.jpg"}
                                sx={{ width: 45, height: 45 }}
                                className='border border-2 border-accent-500 hover:border-accent-300'
                            />
                        </Link>
                        <div className="w-full">
                            <div className="flex items-center space-x-2">
                                <Link href={route('profile', { name: comment.user.name })}>
                                    <h5 className="text-sm font-bold text-text-900">{comment.user.name}</h5>
                                    <small className="text-sm text-text-600">{dayjs(comment.created_at).fromNow()}</small>
                                </Link>
                                {auth.user.id === comment.user.id && (
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button className="text-primary-500">
                                                <FontAwesomeIcon icon={faEllipsisV} />
                                            </button>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content>
                                            <button className="block w-full px-4 py-2 text-left text-sm leading-5 text-text-950 hover:bg-background-100 focus:bg-background-150 transition duration-150 ease-in-out" onClick={() => startEditing(comment)}>
                                                Edit
                                            </button>
                                            <Dropdown.Link as="button" href={route("comments.destroy", comment.id)} method="delete">
                                                Delete
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                )}
                            </div>

                            {editingCommentId === comment.id ? (
                                <form onSubmit={(e) => submit(comment.id, e)}>
                                    <textarea value={data.content} onChange={(e) => setData("content", e.target.value)} className="mt-2 w-full text-gray-900 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"></textarea>
                                    <InputError content={errors.content} className="mt-2" />
                                    <TextInput label="Imagen" type="file" name="image" id="image" ref={fileInputRef} onChange={(e) => setData('image', e.target.files[0])} />
                                    <div className="space-x-2 mt-2">
                                        <PrimaryButton>Save</PrimaryButton>
                                        <button type="button" onClick={cancelEditing}>Cancel</button>
                                    </div>
                                </form>
                            ) : (
                                <div>
                                    <p className="mt-2 text-text-950">{comment.content}</p>
                                    {comment.image && (
                                        <img className="rounded-lg object-cover mt-2" src={comment.image.startsWith("http") ? comment.image : `/storage/${comment.image}`} alt="Comment Image" />
                                    )}
                                </div>
                            )}

                            <div className="mt-2 flex items-center space-x-2">
                                <button
                                    className="flex items-center"
                                    onClick={(e) => isLiked ? handleUnlikeComment(comment.id, e) : handleLikeComment(comment.id, e)}
                                >
                                    {isLiked ? (
                                        <FontAwesomeIcon icon={faHeart} className="mr-2 text-primary-600" />
                                    ) : (
                                        <FontAwesomeIcon icon={faHeartRegular} className="mr-2 text-text-950" />
                                    )}
                                    <p className='text-text-600 text-base font-semibold'>{comment.likes.length}</p>
                                </button>
                                <button className="ml-4 text-primary-500" onClick={() => handleReply(comment.id)}>Reply</button>
                            </div>

                            {replyingCommentId === comment.id && (
                                <div className="mt-4 ml-10">
                                    <CreateCommentReply parentCommentId={comment.id} onCancel={cancelReplying} />
                                </div>
                            )}
                        </div>
                    </div>

                    {comment.replies && comment.replies.length > 0 && (
                        <div className="ml-12 mt-4 space-y-4">
                            {renderComments(comment.replies)}
                        </div>
                    )}
                </div>
            );
        });
    };

    // Agrupar los comentarios por parent_id
    const nestedComments = (comments, parentId = null) => {
        return comments
            .filter(comment => comment.parent_id === parentId)
            .map(comment => ({
                ...comment,
                replies: nestedComments(comments, comment.id)
            }));
    };

    const commentsTree = nestedComments(comments);

    return (
        <div className="mt-4">
            {renderComments(commentsTree)}
        </div>
    );
};

export default CommentList;
