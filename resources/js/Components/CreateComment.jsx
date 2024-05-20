import { useForm } from "@inertiajs/react";
import { useRef } from "react";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import InputError from "./InputError";


export default function CreateComment({ publication,setShowCommentForm}){
  const fileInputRef = useRef(null);
  const { data, setData, post, processing, reset, errors } = useForm({
      content: "",
      image: "",
      publication_id: publication.id,
  });

  const submit = (e) => {
      e.preventDefault();
      setData({
          content: '',
          image: '',
        });
      post(route("comments.store"), {
        onSuccess: () => {
          setShowCommentForm(false)
          reset();
        },
        preserveScroll: true,
      });
      
  };
    return (
      <form onSubmit={submit}>
      <textarea
        value={data.content}
        onChange={(e) => setData("content",e.target.value)}
        placeholder="Write a comment..."
        className="mt-4 w-full text-gray-900 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
      ></textarea>
      <div className="mt-2 flex justify-end space-x-2">
      <InputError content={errors.content} className="mt-2" />
      <TextInput label='Imagen' type='file' name='image' id='image' ref={fileInputRef}
            onChange={(e) => setData('image', e.target.files[0])} />
        <PrimaryButton
          type="submit"
          disabled={processing}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
        >
          Comment
        </PrimaryButton>
        <SecondaryButton
          type="button"
          onClick={() => setShowCommentForm(false)}
        >
          Cancel
        </SecondaryButton>
      </div>
    </form>
    );
}