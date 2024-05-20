import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { usePage, useForm } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";
import TextInput from "./TextInput";

dayjs.extend(relativeTime);

export default function CommentList({ comments, user, likedComments, handleLikeComment, handleUnlikeComment }) {
  const { auth } = usePage().props;
  const fileInputRef = useRef(null);

  if (!comments) {
    return null; // O puedes devolver un mensaje indicando que no hay comentarios
  }

  const [editingCommentId, setEditingCommentId] = useState(null);
  const { data, setData, post, clearErrors, reset, errors } = useForm({ content: "" });

  const submit = (commentId, e) => {
    e.preventDefault();
    post(route("comments.update", commentId), {
      method: "patch",
      onSuccess: () => {
        setEditingCommentId(null);
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
  useEffect(() => {
    console.log('comments', comments)
    console.log("user", user);
  },[])

  return (
    <div className="mt-4 space-y-4">
      {/* {comments.map((comment) => {
        const isAuthor = auth.user.id === comment.user.id;

        return (
          <div key={comment.id} className="flex items-start space-x-4">
            <img className="rounded-full w-10 h-10" src={comment.user.avatar} alt={comment.user.name} />
            <div>
              <div className="flex items-center space-x-2">
                <h5 className="text-sm font-bold">{comment.user.name}</h5>
                <small className="text-sm text-gray-600">{dayjs(comment.created_at).fromNow()}</small>
                {isAuthor && (
                  <Dropdown>
                    <Dropdown.Trigger>
                      <button className="text-gray-500">
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </button>
                    </Dropdown.Trigger>
                    <Dropdown.Content>
                      <button className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 transition duration-150 ease-in-out" onClick={() => startEditing(comment)}>
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
                  <TextInput label='Imagen' type='file' name='image' id='image' ref={fileInputRef}
                    onChange={(e) => setData('image', e.target.files[0])} />
                  <div className="space-x-2 mt-2">
                    <PrimaryButton>Save</PrimaryButton>
                    <button onClick={cancelEditing}>Cancel</button>
                  </div>
                </form>
              ) : (
                <div>
                  <p className="mt-2 text-gray-900">{comment.content}</p>
                  {comment.image && (
                    <img className="rounded-lg object-cover mt-2" src={comment.image.startsWith("http") ? comment.image : `/storage/${comment.image}`} alt="Comment Image" />
                  )}
                </div>
              )}

              <div className="mt-2">
                <PrimaryButton
                  className="flex"
                  variant="ghost"
                  onClick={(e) => likedComments[comment.id] ? handleUnlikeComment(comment.id, e) : handleLikeComment(comment.id, e)}
                >
                  <FontAwesomeIcon icon={faThumbsUp} className="mr-2" />
                  {likedComments[comment.id] ? 'Unlike' : 'Like'} {comment.likes}
                </PrimaryButton>
              </div>
            </div>
          </div>
        );
      })} */}
    </div>
  );
}
