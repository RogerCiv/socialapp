import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faThumbsUp, faComment, faShare } from "@fortawesome/free-solid-svg-icons";
import { useForm, usePage } from "@inertiajs/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Dropdown from "@/Components/Dropdown";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import CommentList from "./CommentList";
import CreateComment from "./CreateComment";
import SecondaryButton from "./SecondaryButton";

dayjs.extend(relativeTime);

export default function Publication({ publication, followers }) {
  const { auth, likePublications = [], likeComments = [], followers: pageFollowers = [] } = usePage().props;
  const [editing, setEditing] = useState(false);
  const [liked, setLiked] = useState(publication.liked);
  const [followed, setFollowed] = useState(publication.followed);
  const [showComments, setShowComments] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [likedComments, setLikedComments] = useState({});

  const isFollowing = pageFollowers.includes(publication.user.id);
  const isAuthor = auth.user.id === publication.user.id;
  const { data, setData, patch, clearErrors, reset, errors, post } = useForm({
    content: publication.content,
  });

  useEffect(() => {
    const isFollow = pageFollowers.includes(publication.user.id);
    const isLiked = likePublications.includes(publication.id);

    setLiked(isLiked);
    setFollowed(isFollow);

    const initialLikedComments = publication.comments.reduce((acc, comment) => {
      acc[comment.id] = likeComments.includes(comment.id);
      return acc;
    }, {});
    setLikedComments(initialLikedComments);
  }, [likePublications, likeComments, pageFollowers, publication.user.id, publication.id, publication.comments]);

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
    post(route("publications.unlike", publicationId), {
      onSuccess: () => {
        setLiked(false);
        reset();
      },
      preserveScroll: true,
    });
  };

  const handleFollow = (userId) => {
    post(route("user.follow", userId), {
      onSuccess: () => {
        setFollowed(true);
        reset();
      },
      preserveScroll: true,
    });
  };

  const handleUnfollow = (userId) => {
    post(route("user.unfollow", userId), {
      onSuccess: () => {
        setFollowed(false);
        reset();
      },
      preserveScroll: true,
    });
  };

  const submit = (e) => {
    e.preventDefault();
    patch(route("publications.update", publication.id), {
      onSuccess: () => {
        setEditing(false);
      },
      preserveScroll: true,
    });
  };

  const handleLikeComment = (commentId, e) => {
    e.preventDefault();
    post(route("comments.like", commentId), {
      onSuccess: () => {
        setLikedComments((prev) => ({ ...prev, [commentId]: true }));
        reset();
      },
      preserveScroll: true,
    });
  };

  const handleUnlikeComment = (commentId, e) => {
    e.preventDefault();
    post(route("comments.unlike", commentId), {
      onSuccess: () => {
        setLikedComments((prev) => ({ ...prev, [commentId]: false }));
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
          <div className="flex">
            <h5 className="text-sm font-bold">{publication.user.name}</h5>
            <small className="ml-2 text-sm text-gray-600">
              {dayjs(publication.created_at).fromNow()}...
            </small>
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
          <div className="space-x-2 mt-4">
            <PrimaryButton>Save</PrimaryButton>
            <button onClick={() => { setEditing(false); reset(); clearErrors(); }}>Cancel</button>
          </div>
        </form>
      ) : (
        <>
          {publication.image && (
            <img className="rounded-lg object-cover" src={publication.image.startsWith("http") ? publication.image : `/storage/${publication.image}`} alt="Publication Image" />
          )}
          <p className="mt-4 text-gray-900">{publication.content}</p>
        </>
      )}

      <div className="flex justify-between items-center justify-center mt-4">
        <div>
          <PrimaryButton className="flex" variant="ghost" onClick={(e) => liked ? handleUnlike(publication.id, e) : handleLike(publication.id, e)}>
            <FontAwesomeIcon icon={faThumbsUp} className="mr-2" />
            {liked ? 'Unlike' : 'Like'} {publication.likes}
          </PrimaryButton>
        </div>

        <div>
          <PrimaryButton className="flex" variant="ghost" onClick={() => setShowCommentForm(true)}>
            <FontAwesomeIcon icon={faComment} className="mr-2" />
            Comment
          </PrimaryButton>
        </div>
        <div className="">
          <SecondaryButton className="flex" variant="ghost" onClick={() => setShowComments(!showComments)}>
            <FontAwesomeIcon icon={faComment} className="mr-2" />
            {showComments ? 'Hide Comments' : 'View Comments'}
          </SecondaryButton>
        </div>
      </div>

      {showCommentForm && (
        <CreateComment publication={publication} setShowCommentForm={setShowCommentForm} />
      )}

      {showComments && (
        <CommentList comments={publication.comments} likedComments={likedComments} handleLikeComment={handleLikeComment} handleUnlikeComment={handleUnlikeComment} />
      )}
    </div>
  );
}
