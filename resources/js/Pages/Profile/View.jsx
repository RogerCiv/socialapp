import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Head, Link, useForm} from "@inertiajs/react";
import DangerButton from "@/Components/DangerButton.jsx";
import CardPub from "@/Components/CardPub.jsx";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "@/Components/TabPanel.jsx";
import Avatar from '@mui/material/Avatar';
import { styled } from "@mui/material/styles";
import AllInboxIcon from "@mui/icons-material/AllInbox.js";
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import SnackbarWithDecorators from "@/Components/SnackbarWithDecorators.jsx";

export default function View({
                                 auth,
                                 user,
                                 isCurrentUserFollower,
                                 followerCount,
                                 publications,
                                 followers,
                                 followings,
    success,errors
                             }) {
    const [value, setValue] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarColor, setSnackbarColor] = useState("success");
    // const [coverImageSrc, setCoverImageSrc] = useState(`/storage/${user.cover}` || "/img/cover-space.jpg");
    const [coverImageSrc, setCoverImageSrc] = useState('');

    const isMyProfile = auth.user && auth.user.id === user.id;

    const imagesForm = useForm({
        cover: null
    });

    const followUserForm = useForm({
        follow: !isCurrentUserFollower,
    });

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function followUser() {
        followUserForm.post(route("user.follow", user.id), {
            preserveScroll: true,
            onSuccess: () => {
                followUserForm.setData("follow", !followUserForm.data.follow);
                const newFollowStatus = !followUserForm.data.follow;
                if (!newFollowStatus) {
                    setSnackbarMessage(`Siguiendo al usuario ${user.name}`);
                    setSnackbarColor("success");
                } else {
                    setSnackbarMessage(`Dejando de seguir al usuario ${user.name}`);
                    setSnackbarColor("danger");
                }
                setSnackbarOpen(true);
            },
        });
    }

    function onCoverChange(event) {
        const coverImageFile = event.target.files[0];
        if (coverImageFile) {
            const reader = new FileReader();
            reader.onload = () => {
                setCoverImageSrc(reader.result);
            };
            reader.readAsDataURL(coverImageFile);
            imagesForm.setData('cover', coverImageFile);
        }
    }

    function resetCoverImage() {
        imagesForm.setData('cover', null);
        setCoverImageSrc('');
    }

    function submitCoverImage() {
        imagesForm.post(route('profile.cover'), {
            preserveScroll: true,
            onSuccess: () => {
                resetCoverImage();
            },
        });
    }

    const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
        ({ theme }) => ({
            textTransform: 'none',
            fontWeight: theme.typography.fontWeightRegular,
            fontSize: theme.typography.pxToRem(15),
            marginRight: theme.spacing(1),
            color: 'rgba(250,250,250,0.89)',
            '&.Mui-selected': {
                color: '#b0700c',
            },
            '&.Mui-focusVisible': {
                backgroundColor: 'rgba(110,224,78,0.32)',
            },
        }),
    );
    const coverSrc = coverImageSrc ? coverImageSrc : (user.cover ? `/storage/${user.cover}` : '/img/cover-space.jpg');

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Perfil de ${user.name}`}/>
            <div className="container max-w-7xl mx-auto bg-background-100 space-y-10">
                <div className="group relative bg-background-200 space-x-8 mt-8">

                    <div className="px-4">
                        {success && (
                            <div className="my-2 py-2 px-3 font-medium text-sm bg-emerald-500 text-white">
                                {success}
                            </div>
                        )}
                        {errors?.cover && (
                            <div className="my-2 py-2 px-3 font-medium text-sm bg-red-400 text-white">
                                {errors.cover}
                            </div>
                        )}
                        <div className="group relative bg-background-200 space-x-8 mt-8">
                            <img
                                alt={`${user.name} Cover`}
                                src={coverSrc}
                                className="w-full h-[200px] object-cover"
                            />
                            {isMyProfile && (
                            <div className="absolute top-2 right-2">
                                {!coverImageSrc && (
                                    <button
                                        className="bg-accent-700 hover:bg-gray-100 text-text-50 py-1 px-2 text-sm flex items-center opacity-0 group-hover:opacity-100">
                                        Update Cover Image
                                        <input
                                            type="file"
                                            className="absolute left-0 top-0 bottom-0 right-0 opacity-0"
                                            onChange={onCoverChange}
                                        />
                                    </button>
                                )}
                                {coverImageSrc && (
                                    <div className="flex gap-2 bg-background-50  p-2 opacity-80 group-hover:opacity-100">
                                        <button
                                            onClick={resetCoverImage}
                                            className="bg-gray-50 hover:bg-red-500 text-gray-800 py-1 px-2 text-xs flex items-center hover:text-text-950 "
                                        >
                                            <CloseIcon className="h-3 w-3 mr-2"/>
                                            Cancel
                                        </button>
                                        <button
                                            onClick={submitCoverImage}
                                            className="bg-primary-400 hover:bg-primary-600 text-text-950 py-1 px-2 text-xs flex items-center"
                                        >
                                            <CheckIcon className="h-3 w-3 mr-2"/>
                                            Submit
                                        </button>
                                    </div>
                                )}
                            </div>
                    )}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-20 mt-4 md:mt-0 py-2">
                        <Avatar
                            alt={`${user.name} Avatar`}
                            src={user.avatar ? `/storage/${user.avatar}` : "/img/avatar_default.jpg"}
                            sx={{width: 56, height: 56}}
                            className='border border-2 border-accent-500 hover:border-accent-300'
                        />
                        <div className="text-center md:text-left mt-4 md:mt-0">
                            <h1 className="text-2xl font-semibold text-text-950">Perfil de <span
                                className='text-primary-500 font-bold'>{user.name}</span></h1>
                            <p className='text-secondary-600 font-semibold'>
                                Tienes <span className='text-text-950'>{followerCount}</span>
                                <small>followers...</small>
                            </p>
                        </div>

                        <div className="mt-4 mb-4 md:mt-0 md:mb-0">
                            {!isMyProfile && (
                                isCurrentUserFollower ? (
                                    <DangerButton onClick={followUser} className="flex" variant="ghost">
                                        Unfollow
                                    </DangerButton>
                                ) : (
                                    <PrimaryButton onClick={followUser}
                                                   className="flex bg-primary-400 hover:bg-primary-500">
                                        Follow
                                    </PrimaryButton>
                                )
                            )}

                            {isMyProfile && (
                                <Link href={route("profile.edit")}>
                                    <PrimaryButton className="flex bg-primary-400 hover:bg-primary-500 "
                                                   variant="ghost">
                                        <FontAwesomeIcon icon={faPenToSquare}/>
                                        Edit Profile
                                    </PrimaryButton>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <Box sx={{width: "100%", bgcolor: 'var(--background-100)', borderRadius: 1}} p={2}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            centered
                            variant="fullWidth"
                        >
                            <StyledTab icon={<AllInboxIcon/>} label="Publications"/>
                            <StyledTab icon={<GroupIcon/>} label="Followers"/>
                            <StyledTab icon={<PersonIcon/>} label="Followings"/>
                        </Tabs>
                    </Box>
                </div>
                <div className="max-w-7xl mx-auto min-h-full">
                    <TabPanel value={value} index={0}>
                        <div className="flex flex-col justify-center items-center place-items-center">
                            <div className='grid grid-cols-1 justify-center place-items-center max-w-4xl space-y-6'>

                                {publications.map((publication) => (
                                    <CardPub publication={publication} key={publication.id} user={user}/>
                                ))}
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <div className="flex items-center justify-center">
                            {followers.length === 0 && <p className='text-text-800'>No followers yet...</p>}
                            <div
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 max-w-6xl">
                                {followers.map((follower) => (
                                    <Link href={route('profile', {name: follower.name})} key={follower.id}>
                                    <div key={follower.id}
                                             className="bg-secondary-400 p-4 rounded-xl flex flex-col items-center hover:bg-secondary-500 ">
                                            <img
                                                className="size-20 rounded-full mb-2"
                                                src={follower.avatar ? `/storage/${follower.avatar}` : "/img/avatar_default.jpg"}
                                                alt={`${follower.name}'s avatar`}
                                            />
                                            <h3 className="text-center text-text-950">{follower.name}</h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel value={value} index={2}>
                        <div className="flex items-center justify-center">
                            {followings.length === 0 && <p>No followings yet...</p>}
                            <div className="flex flex-col md:flex-row items-center space-x-8 space-y-4">
                                {followings.map((following) => (
                                    <Link href={route('profile', { name: following.name })} key={following.id}>
                                        <div key={following.id}
                                             className="bg-secondary-400 p-4 rounded-xl flex flex-col items-center hover:bg-secondary-500 ">
                                            <img className="size-20 rounded-full mb-2"
                                                 src={following.avatar ? `/storage/${following.avatar}` : "/img/avatar_default.jpg"}
                                                 alt="" />
                                            <h3 className="text-center text-text-950">{following.name}</h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </TabPanel>
                </div>
            </div>
            <SnackbarWithDecorators
                message={snackbarMessage}
                open={snackbarOpen}
                onClose={() => setSnackbarOpen(false)}
                color={snackbarColor}
            />
        </AuthenticatedLayout>
    );
}
