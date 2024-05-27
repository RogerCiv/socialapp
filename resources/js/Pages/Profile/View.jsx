import React, {useEffect, useState} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link, useForm} from "@inertiajs/react";
import DangerButton from "@/Components/DangerButton.jsx";
import CardPub from "@/Components/CardPub.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "@/Components/TabPanel.jsx";
import Avatar from '@mui/material/Avatar';
export default function View({
                                 mustVerifyEmail,
                                 status,
                                 auth,
                                 user,
                                 isCurrentUserFollower,
                                 followerCount,
                                 publications,
                                 followers,
                                 followings,
                             }) {
    let coverImageFile = null;
    const authUser = auth.user;
    const isMyProfile = auth.user && auth.user.id === user.id;

    const imagesForm = useForm({
        avatar: null,
        cover: null,
    });

    const followUserForm = useForm({
        follow: !isCurrentUserFollower,
    });

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function followUser() {
        followUserForm.post(route("user.follow", user.id), {
            preserveScroll: true,
            onSuccess: () => {
                followUserForm.setData("follow", !followUserForm.data.follow);
            },
        });
    }

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

    useEffect(() => {
        console.log(user);

    }, []);

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="container mx-auto bg-gray-200 space-y-10">
                <div className="group relative bg-white space-x-8 mt-8">
                    <img
                        className="w-full h-[200px] object-cover"
                        src={user.cover || "/img/cover.jpg"}
                        alt=""
                    />
                    <div className="absolute top-2 right-2">
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
                    <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-20 mt-4 md:mt-0 py-2">
                        <Avatar
                            alt={`${user.name} Avatar`}
                            src={user.avatar ? `/storage/${user.avatar}` : "/img/avatar_default.jpg"}
                            sx={{ width: 56, height: 56 }}
                        />
                        <div className="text-center md:text-left mt-4 md:mt-0">
                            <h1 className="text-2xl font-semibold">PROFILE {user.name}</h1>
                            <p>
                                {user.name} tienes {followerCount} <small>followers...</small>
                            </p>
                        </div>

                        <div className="mt-4 mb-4 md:mt-0 md:mb-0">
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
                                <Link href={route("profile.edit")}>
                                    <PrimaryButton className="flex" variant="ghost">
                                        <FontAwesomeIcon icon={faPenToSquare}/>
                                        Edit Profile
                                    </PrimaryButton>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <Box sx={{width: "100%", bgcolor: "background.paper", borderRadius: 1}} p={2}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            centered
                            variant="fullWidth"
                        >
                            <Tab label="Publications"/>
                            <Tab label="Followers"/>
                            <Tab label="Followings"/>
                        </Tabs>
                    </Box>
                </div>
                <div className="max-w-2xl mx-auto">
                    <TabPanel value={value} index={0}>
                        <div className="space-y-8 flex flex-col">
                            {publications.map((publication) => (
                                <CardPub publication={publication} key={publication.id} user={user}/>
                            ))}
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <div className="text-center">
                            <h2>Followers</h2>
                            <TextInput label="Search" placeholder="Search Followers" type="text" name="searchFollower"
                                       id="searchFollower"/>
                            {followers.length === 0 && <p>No followers yet...</p>}
                            <div className="flex flex-col md:flex-row items-center space-x-8 space-y-4">
                                {followers.map((follower) => (
                                    <div key={follower.id} className="flex items-center space-x-4">
                                        <img className="w-[50px] h-[50px] rounded-full"
                                             src={follower.avatar ? `/storage/${follower.avatar}` : "/img/avatar_default.jpg"} alt=""/>
                                        <Link href={route('profile', {name: follower.name})}>
                                            <h3>{follower.name}</h3>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <div className="text-center">
                            <h2>Followings</h2>
                            <TextInput label="Search" placeholder="Search Followings" type="text"
                                       name="searchFollowings" id="searchFollowings"/>
                            {followings.length === 0 && <p>No followings yet...</p>}
                            <div className="flex flex-col md:flex-row items-center space-x-8 space-y-4">
                                {followings.map((following) => (
                                    <div key={following.id} className="flex items-center space-x-4">
                                        <img className="w-[50px] h-[50px] rounded-full"
                                             src={following.avatar ? `/storage/${following.avatar}` : "/img/avatar_default.jpg"} alt=""/>
                                        <Link href={route('profile', {name: following.name})}>
                                            <h3>{following.name}</h3>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabPanel>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
