import React, { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faThumbsUp, faComment, faShare } from "@fortawesome/free-solid-svg-icons";

import PrimaryButton from "@/Components/PrimaryButton";
import { useForm } from "@inertiajs/react";

dayjs.extend(relativeTime);

export default function CommentList({ comments }) {
  const [liked, setLiked] = useState();


  const { data, setData, patch, clearErrors, reset, errors, post } = useForm({
    
  });

  const handleLike = (publicationId, e) => {
    e.preventDefault();
    post(route("comments.like", publicationId), {
      onSuccess: () => {
        setLiked(true);
        reset();
      },
      preserveScroll: true,
    });
  };

  const handleUnlike = (publicationId, e) => {
    post(route("comments.unlike", publicationId), {
      onSuccess: () => {
        setLiked(false);
        reset();
      },
      preserveScroll: true,
    });
  };
  return (
    <div className="mt-4 space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start space-x-4">
          <img className="rounded-full w-10 h-10" src={comment.user.avatar} alt={comment.user.name} />
          <div>
            <div className="flex items-center space-x-2">
              <h5 className="text-sm font-bold">{comment.user.name}</h5>
              <small className="text-sm text-gray-600">{dayjs(comment.created_at).fromNow()}</small>
            </div>
            <p className="mt-2 text-gray-900">{comment.content}</p>
            {comment.image && (
              <img className="rounded-lg object-cover mt-2" src={comment.image.startsWith("http") ? comment.image : `/storage/${comment.image}`} alt="Comment Image" />
            )}
            <div>
          <PrimaryButton className="flex" variant="ghost" onClick={(e) => liked ? handleUnlike(comment.id, e) : handleLike(comment.id, e)}>
            <FontAwesomeIcon icon={faThumbsUp} className="mr-2" />
            {liked ? 'Unlike' : 'Like'} {comment.likes}
          </PrimaryButton>
        </div>
          </div>
        </div>
      ))}
    </div>
  );
}
