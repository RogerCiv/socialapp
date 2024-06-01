import * as React from 'react';
import {useForm, Head, Link, router} from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CardPub from "@/Components/CardPub.jsx";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "@/Components/TabPanel.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';
import TextField from '@mui/material/TextField';
import {useEffect, useRef, useState} from "react";
import CreatePublicationDialog from "@/Components/CreatePublicationDialog.jsx";
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
export default function Index({ auth, user, publications, publicationsForUser, top3Pub, top3Comments }) {
    const fileInputRef = useRef(null);
    const { data, setData, post, processing, reset, errors } = useForm({
        content: "",
        image: "",
    });
    const [keywords, setKeywords] = useState('');
    // const keywords = useRef('');
    const crownColors = ["text-yellow-500", "text-slate-500", "text-[#bf8970] "];
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
    const [value, setValue] = React.useState(0);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        // console.log(publicationsForUser);
        // console.log(publications)
    }, []);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            router.get(route('search', encodeURIComponent(keywords)));
            search();
        }
    };

    const search = () => {

        console.log('Realizar búsqueda con palabras clave:', keywords);
    };
    const submit = (e) => {
        e.preventDefault();
        console.log(data);
        post(route("publications.store"), { onSuccess: () => reset() });
        setData({
            content: '',
            image: '',
        });
        setOpen(false)
    };

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
                backgroundColor: 'rgba(33,110,9,0.32)',
            },
        }),
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Publication" />

            <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
                <div
                    className='flex flex-col md:flex-row justify-center items-center md:justify-between space-y-6 mb-4 md:space-y-0 md:space-x-8'>
                    <div className='w-full md:w-auto'>

                        <TextField
                            fullWidth={true}
                            label='Search...'
                            id="filled-hidden-label-normal"
                            placeholder="Search Publications"
                            variant="filled" color="warning" focused
                            onChange={(e) => setKeywords(e.target.value)}
                            onKeyDown={handleKeyDown}

                        />

                        {/*<TextField label="Outlined secondary" color="warning" focused />*/}

                    </div>
                    <div className='w-full md:w-auto'>
                        <Button color="warning" variant="contained" size='medium' onClick={handleClickOpen}>
                            Crear Publicación
                        </Button>
                        <CreatePublicationDialog
                            open={open}
                            handleClose={handleClose}
                            submit={submit}
                            data={data}
                            setData={setData}
                            errors={errors}
                            fileInputRef={fileInputRef}
                            processing={processing}
                        />
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
                            {/*<Tab label="All"/>*/}
                            {/*<Tab label="Trend"/>*/}
                            {/*<Tab label="Stats"/>*/}
                            {/*<Tab label={<Typography variant="bodySM">All</Typography>} />*/}
                            {/*<Tab label={<Typography variant="bodySM">Trend</Typography>} />*/}
                            {/*<Tab label={<Typography variant="bodySM">Stats</Typography>} />*/}
                            <StyledTab icon={<AllInboxIcon/>} label="All"/>
                            <StyledTab icon={<TrendingUpIcon/>} label="Trend"/>
                            <StyledTab icon={<QueryStatsIcon/>} label="Stats"/>
                        </Tabs>
                    </Box>
                </div>

                <div className="mt-6 bg-background-100 shadow-sm rounded-lg divide-y">
                    <TabPanel value={value} index={0}>
                        <div className="space-y-8 flex flex-col">
                            {publications.map((publication) => (
                                <CardPub publication={publication} key={publication.id} user={user}/>
                            ))}
                        </div>
                    </TabPanel>
                </div>
                <div className="mt-6 bg-background-100 shadow-sm rounded-lg divide-y">
                    <TabPanel value={value} index={1}>
                        <div className="space-y-8 flex flex-col">
                            {publicationsForUser.map((publication) => (
                                <CardPub publication={publication} key={publication.id} user={user}/>
                            ))}
                        </div>
                    </TabPanel>
                </div>
                <div className="mt-6 bg-background-100 shadow-sm rounded-lg divide-y">
                    <TabPanel value={value} index={2}>
                        <div className='flex flex-col '>
                            <div className='flex flex-col space-y-6 py-10'>
                                <h2 className="text-2xl text-center font-bold mb-4">Top 3 Usuarios con Más
                                    Publicaciones</h2>
                                <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={4}
                                     sx={{'@media (max-width: 768px)': {gridTemplateColumns: '1fr'}}}>
                                    {top3Pub.map((user, index) => (
                                        <Link href={route('profile', {name: user.user.name})} key={user.user.id}>
                                            <Card orientation="horizontal" variant="outlined" key={user.user.id}>
                                                <CardOverflow>
                                                    <AspectRatio ratio="1" sx={{width: 90, paddingTop: 1}}>
                                                        <img
                                                            className="rounded-full w-24 h-24 mx-auto"
                                                            src={user.user.avatar ? `/storage/${user.user.avatar}` : '/img/avatar_default.jpg'}
                                                            alt=""
                                                        />
                                                    </AspectRatio>
                                                </CardOverflow>
                                                <CardContent>
                                                    <Typography fontWeight="md" textColor="success.plainColor">
                                                        {user.user.name ? user.user.name : 'Unknown'}
                                                    </Typography>
                                                    <Typography level="body-sm">Puesto #{index + 1}</Typography>
                                                    <Typography
                                                        level="body-sm">Publicaciones: {user.publications_count}</Typography>
                                                </CardContent>
                                                <CardOverflow
                                                    variant="soft"
                                                    color="primary"
                                                    sx={{
                                                        px: 0.2,
                                                        writingMode: 'vertical-rl',
                                                        justifyContent: 'center',
                                                        fontSize: 'xs',
                                                        fontWeight: 'xl',
                                                        letterSpacing: '1px',
                                                        textTransform: 'uppercase',
                                                        borderLeft: '1px solid',
                                                        borderColor: 'divider',
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faCrown}
                                                        className={`absolute -top-2 right-0 h-8 w-8 ${crownColors[index]}`}
                                                        title={`Crown ${index + 1}`}
                                                    />
                                                </CardOverflow>
                                            </Card>
                                        </Link>
                                    ))}
                                </Box>
                            </div>
                            <div className="flex flex-col space-y-6 py-10">
                                <h2 className="text-2xl text-center font-bold ">Top 3 Usuarios con Más Comentarios</h2>
                                <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={4}
                                     sx={{'@media (max-width: 768px)': {gridTemplateColumns: '1fr'}}}>
                                    {top3Comments.map((comment, index) => (
                                        <Link href={route('profile', {name: comment.user.name})} key={comment.user.id}>
                                            <Card orientation="horizontal" variant="outlined">
                                                <CardOverflow>
                                                    <AspectRatio ratio="1" sx={{width: 90, paddingTop: 1}}>
                                                        <img
                                                            className="rounded-full w-24 h-24 mx-auto"
                                                            src={comment.user.avatar ? `/storage/${comment.user.avatar}` : '/img/avatar_default.jpg'}
                                                            alt=""
                                                        />
                                                    </AspectRatio>
                                                </CardOverflow>
                                                <CardContent>
                                                    <Typography fontWeight="md" textColor="success.plainColor">
                                                        {comment.user.name ? comment.user.name : 'Unknown'}
                                                    </Typography>
                                                    <Typography level="body-sm">Puesto #{index + 1}</Typography>
                                                    <Typography
                                                        level="body-sm">Comentarios: {comment.comments_count}</Typography>
                                                </CardContent>
                                                <CardOverflow
                                                    variant="soft"
                                                    color="primary"
                                                    sx={{
                                                        px: 0.2,
                                                        writingMode: 'vertical-rl',
                                                        justifyContent: 'center',
                                                        fontSize: 'xs',
                                                        fontWeight: 'xl',
                                                        letterSpacing: '1px',
                                                        textTransform: 'uppercase',
                                                        borderLeft: '1px solid',
                                                        borderColor: 'divider',
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faCrown}
                                                        className={`absolute -top-2 right-0 h-8 w-8 ${crownColors[index]}`}
                                                        title={`Crown ${index + 1}`}
                                                    />
                                                </CardOverflow>
                                            </Card>
                                        </Link>
                                    ))}

                                </Box>

                            </div>
                        </div>
                    </TabPanel>
                </div>
                </div>
        </AuthenticatedLayout>
);
}
