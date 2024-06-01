import {useForm} from "@inertiajs/react";
import React, {useRef} from "react";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import InputError from "./InputError";
import Button from "@mui/material/Button";

import CloudUploadIcon from "@mui/icons-material/CloudUpload.js";
import {styled} from "@mui/material/styles";

export default function CreateComment({publication, setShowCommentForm}) {
    const fileInputRef = useRef(null);
    const {data, setData, post, processing, reset, errors} = useForm({
        content: "",
        image: "",
        publication_id: publication.id,
    });
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("content", data.content);
        formData.append("publication_id", data.publication_id);
        if (data.image) {
            formData.append("image", data.image);
        }

        post(route("comments.store"), {
            data: formData,
            onSuccess: () => {
                setShowCommentForm(false);
                reset();
            },
            preserveScroll: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    };

    return (
        <form onSubmit={submit}>
      <textarea
          value={data.content}
          onChange={(e) => setData("content", e.target.value)}
          placeholder="Write a comment..."
          className="mt-4 w-full text-gray-900 border-secondary-400 focus:border-secondary-300 focus:ring focus:ring-secondary-200 focus:ring-opacity-50 rounded-md shadow-sm"
      ></textarea>
            <div className="mt-2 flex justify-end space-x-2">
                <InputError content={errors.content} className="mt-2"/>
                {/*<TextInput*/}
                {/*    label="Imagen"*/}
                {/*    type="file"*/}
                {/*    name="image"*/}
                {/*    id="image"*/}
                {/*    ref={fileInputRef}*/}
                {/*    onChange={(e) => setData("image", e.target.files[0])}*/}
                {/*/>*/}
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon/>}
                    size='medium'
                    color='secondary'
                >
                    Imagen
                    <VisuallyHiddenInput type="file" name='image' id='image' ref={fileInputRef}
                                         onChange={(e) => setData('image', e.target.files[0])}/>
                </Button>

                <Button type="submit" disabled={processing} variant="contained" color="warning">
                    Comment
                </Button>
                <Button onClick={() => setShowCommentForm(false)} variant="contained" color="error">
                    Cancel
                </Button>
            </div>
        </form>
    );
}
