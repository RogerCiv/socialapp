import {useEffect, useRef} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function View({ mustVerifyEmail, status, auth, user }) {
    const coverImageSrc = useRef('')
    const authUser = auth.user;
    const isMyProfile = auth.user && auth.user.id === user.id;

    function onCoverChange(e){
        console.log(e)
        const file = e.target.files[0]
        if(file){
            const reader = new FileReader()
            reader.onload = () =>{
                console.log(reader.result)
                coverImageSrc.value = reader.result;
            }
            reader.readAsDataURL(file)
        }
    }
    useEffect(() => {
        console.log(authUser);
        console.log("My profile:", isMyProfile);
    }, []);

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="container mx-auto bg-gray-200">
                <div className="group relative bg-white">
                    <img className="w-full h-full object-contain" src={user.cover || 'default_cover_url'} alt="" />
                    <button className=" top-2 righ-2 bg-gray-50 hover:bg-gray-100 text-gray-800 py-1 px-2 text-sm
                    flex items-center opacity-0 group-hover:opacity-100">
                      Update Cover Image
                      <input type="file" className="absolute left-0 top-0 bottom-0 right-0 opacity-0 cursor-pointer"
                      onChange={onCoverChange}/>
                    </button>
                </div>
                <div className="flex items-center space-x-4">
                    <img className="w-[100px] h-[100px] rounded-full" src={user.avatar || 'default_avatar_url'} alt="" />
                    <h1>PROFILE {user.name}</h1>

                    {isMyProfile && (
                        <PrimaryButton className="flex" variant="ghost">
                            <FontAwesomeIcon icon={faPenToSquare} />
                            Edit Profile
                        </PrimaryButton>
                    )}
                </div>
                <div>
                    <h2>POSTS</h2>
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
