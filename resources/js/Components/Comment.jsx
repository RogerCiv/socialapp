import React from 'react'

const Comment = () => {
  const { data, setData, post, processing, reset, errors } = useForm({
    content: "",
    image: "",
});

const submit = (e) => {
    e.preventDefault();
    setData({
        content: '',
        image: '',
      });
    post(route("publications.store"), { onSuccess: () => reset() });
};
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
    <form onSubmit={submit}>
        <textarea
            value={data.content}
            placeholder="What's on your mind?"
            className="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
            onChange={(e) => setData("content", e.target.value)}
        ></textarea>
        <InputError content={errors.content} className="mt-2" />


        <PrimaryButton className="mt-4" disabled={processing}>
            Publicar
        </PrimaryButton>
    </form>
    </div>
  )
}

export default Comment