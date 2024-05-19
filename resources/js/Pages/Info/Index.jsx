import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";

// Define los colores de las coronas
const crownColors = ["text-yellow-500", "text-slate-500", "text-[#bf8970] "];

export default function Info({ auth, publicationsByUser, followers, top3Pub }) {
  useEffect(() => {
    console.log("followers:", followers);
    console.log("top3Pub:", top3Pub);
    console.log("Publications:", publicationsByUser.map((publication) => publication.content));
  }, []);

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Info" />
      <div>
        <h1>Info</h1>

        <div className="flex flex-col md:grid md:grid-cols-12 place-content-center">


          <div className="col-span-4">
            <h2>Amigos</h2>
            <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              {followers.map((follower) => (
                <div key={follower.id} className="p-5 border-b border-gray-200 dark:border-gray-700 space-y-4">
                  <a href="#" className="inline-block mb-3">
                    <img
                      className="rounded-full"
                      src={follower.follower_avatar}
                      alt=""
                    />
                  </a>
                  <a href="#" className="inline-block mb-2">
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{follower.follower_name}</h5>
                  </a>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{follower.email}</p>
                  <PrimaryButton>Follow</PrimaryButton>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-4">
            <h2>Top 3 Usuarios con Más Publicaciones</h2>
            <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              {top3Pub.map((user, index) => (
                <div key={user.user_id} className="p-5 border-b border-gray-200 dark:border-gray-700 space-y-4">
                  <div className="flex items-center space-x-4">
                    <img
                      className="rounded-full"
                      src={user.user.avatar}
                      alt=""
                    />
                    <div className="flex items-center">
                      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{user.user.name}</h5>
                      <FontAwesomeIcon
                        icon={faCrown}
                        className={`ml-2 h-8 w-8 ${crownColors[index]}`}
                        title={`Crown ${index + 1}`}
                      />
                    </div>
                  </div>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    Publicaciones: {user.publications_count}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-4">
            <h2 className="text-2xl">Mis Publicaciones</h2>
            <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              {publicationsByUser.map((publication) => (
                <div key={publication.id} className="p-5 border-b border-gray-200 dark:border-gray-700 space-y-4">
                  <a href="#" className="inline-block mb-3">
                    <img
                      className="rounded-3xl"
                      src={`/storage/${publication.image}`}
                      alt=""
                    />
                  </a>
                  <a href="#" className="inline-block mb-2">
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{publication.content}</h5>
                  </a>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{publication.content}</p>
                  <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Read more
                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
