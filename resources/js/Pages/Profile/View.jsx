import {useEffect, useRef} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useForm} from "@inertiajs/react";
import DangerButton from "@/Components/DangerButton.jsx";
import Publication from "@/Components/Publication.jsx";
import CardPub from "@/Components/CardPub.jsx";

export default function View({mustVerifyEmail, status, auth, user, isCurrentUserFollower, followerCount, publications}) {
    let coverImageFile = null;

    const coverImageSrc = useRef('');
    const authUser = auth.user;
    const isMyProfile = auth.user && auth.user.id === user.id;
    const imagesForm = useForm({
        avatar: null,
        cover: null,
    });

    const followUserForm = useForm({
        follow: !isCurrentUserFollower
    });

    function onCoverChange(e) {
        coverImageFile = e.target.files[0];
        if (coverImageFile) {
            const reader = new FileReader();
            reader.onload = () => {
                coverImageSrc.current = reader.result;
            };
            reader.readAsDataURL(coverImageFile);
        }
    }

    function followUser() {
        followUserForm.post(route('user.follow', user.id), {
            preserveScroll: true,
            onSuccess: () => {
                // Actualiza el estado de isCurrentUserFollower
                followUserForm.setData('follow', !followUserForm.data.follow);
            },
        });
    }

    useEffect(() => {
        // console.log(authUser);
        // console.log("My Pubs:", publications);
        // console.log("My profile:", followers);
        // console.log("My profile:", comments);
        // console.log("Comments Pub:", comments.map((comment) => comment.content));
    }, [authUser, isMyProfile]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="container mx-auto bg-gray-200">
                <div className="group relative bg-white">
                    <img className="w-full h-full object-contain" src={user.cover || '/img/cover.jpg'} alt=""/>
                    <div className="absolute top-2 righ-2">
                        <button
                            className="bg-gray-50 hover:bg-gray-100 text-gray-800 py-1 px-2 text-sm flex items-center opacity-0 group-hover:opacity-100">
                            Update Cover Image
                            <input
                                type="file"
                                className="absolute left-0 top-0 bottom-0 right-0 opacity-0 cursor-pointer"
                                onChange={onCoverChange}
                            />
                        </button>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <img className="w-[100px] h-[100px] rounded-full" src={user.avatar || 'default_avatar_url'} alt=""/>
                    <h1>PROFILE {user.name}</h1>
                    <p>{user.name} tienes {followerCount} <small>followers...</small></p>

                    {!isMyProfile && (
                        isCurrentUserFollower ? (
                            <DangerButton onClick={followUser} className="flex" variant="ghost">
                                Unfollow
                            </DangerButton>
                        ) : (
                            <PrimaryButton onClick={followUser} className="flex" variant="ghost">
                                Follow
                            </PrimaryButton>
                        )
                    )}

                    {isMyProfile && (
                        <PrimaryButton className="flex" variant="ghost">
                            <FontAwesomeIcon icon={faPenToSquare}/>
                            Edit Profile
                        </PrimaryButton>
                    )}
                </div>
                <div className="max-w-2xl">
                    <h2>POSTS</h2>
                    <div>
                        {publications.map((publication) => (
                            <CardPub publication={publication} key={publication.id} user={user}/>
                        ))}
                    </div>
                </div>
                <div>
                    <h2>Followers</h2>
                </div>
                <div>
                    <h2>Followings</h2>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
