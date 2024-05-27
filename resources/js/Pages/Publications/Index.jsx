import * as React from 'react';
import { useForm, Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import CardPub from "@/Components/CardPub.jsx";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "@/Components/TabPanel.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextInput from "@/Components/TextInput.jsx";
import { Textarea } from "@mui/joy";
import { styled } from '@mui/material/styles';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Avatar from "@mui/material/Avatar";
import TextField from '@mui/material/TextField';
import { useEffect } from "react";

export default function Index({ auth, user, publications, publicationsForUser, top3Pub, top3Comments, top3LikedPublications }) {
    const fileInputRef = React.useRef(null);
    const { data, setData, post, processing, reset, errors } = useForm({
        content: "",
        image: "",
    });
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

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Publication" />

            <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className='flex flex-col md:flex-row space-y-6 justify-center items-center md:justify-between  space-x-8'>
                    <div className='flex-none  self-center justify-self-center'>
                        <TextField
                            fullWidth={true}
                            hiddenLabel
                            id="filled-hidden-label-normal"
                            placeholder="Search Publications"
                            variant="filled"
                        />
                    </div>
                    <div className='flex justify-center  items-center mb-10 grow'>
                        <Button color="primary" variant="contained" size='large' onClick={handleClickOpen}>
                            Crear Publicación
                        </Button>
                        <Dialog open={open} onClose={handleClose}>

                            <DialogTitle>Crear Publicación</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Para crear una nueva publicación, por favor ingrese el contenido y/o seleccione una imagen.
                                </DialogContentText>
                                <form id="publication-form" onSubmit={submit}>
                                    <Textarea
                                        color="primary"
                                        minRows={4}
                                        placeholder="Publication Content"
                                        size="lg"
                                        variant="solid"
                                        name="content"
                                        id="content"
                                        onChange={(e) => setData("content", e.target.value)}

                                    />
                                    <InputError message={errors.content} className="mt-2" />
                                    <div className='mt-4'>

                                        <Button
                                            component="label"
                                            role={undefined}
                                            variant="contained"
                                            tabIndex={-1}
                                            startIcon={<CloudUploadIcon />}
                                            size='medium'
                                        >
                                            Upload Image
                                            <VisuallyHiddenInput type="file" name='image' id='image' ref={fileInputRef}
                                                onChange={(e) => setData('image', e.target.files[0])} />
                                        </Button>
                                        <InputError message={errors.image} className="mt-2" />
                                    </div>
                                </form>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>Cancelar</Button>
                                <Button type="submit" form="publication-form" disabled={processing}>
                                    Publicar
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <Box sx={{ width: "100%", bgcolor: "background.paper", borderRadius: 1 }} p={2}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            centered
                            variant="fullWidth"
                        >
                            <Tab label="All" />
                            <Tab label="Trend" />
                            <Tab label="Stats" />
                        </Tabs>
                    </Box>
                </div>

                <div className="mt-6 bg-white shadow-sm rounded-lg divide-y">
                    <TabPanel value={value} index={0}>
                        <div className="space-y-8 flex flex-col">
                            {publications.map((publication) => (
                                <CardPub publication={publication} key={publication.id} user={user} />
                            ))}
                        </div>
                    </TabPanel>
                </div>

                <TabPanel value={value} index={1}>
                    <div className="space-y-8 flex flex-col">
                        {publicationsForUser.map((publication) => (
                            <CardPub publication={publication} key={publication.id} user={user} />
                        ))}
                    </div>
                </TabPanel>

                <TabPanel value={value} index={2}>
                    <div className='flex flex-col '>
                        <div className='flex flex-col space-y-6 py-10'>
                            <h2 className="text-2xl text-center font-bold mb-4">Top 3 Usuarios con Más Publicaciones</h2>
                            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={4} sx={{ '@media (max-width: 768px)': { gridTemplateColumns: '1fr' } }}>
                                {top3Pub.map((user, index) => (
                                    <Link href={route('profile', { name: user.user.name })}>
                                        <Card orientation="horizontal" variant="outlined" key={user.user.id}>
                                            <CardOverflow>
                                                <AspectRatio ratio="1" sx={{ width: 90, paddingTop: 1 }}>
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
                                                <Typography level="body-sm">Publicaciones: {user.publications_count}</Typography>
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
                            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={4} sx={{ '@media (max-width: 768px)': { gridTemplateColumns: '1fr' } }}>
                                {top3Comments.map((comment, index) => (
                                    <Link href={route('profile', { name: comment.user.name })}>
                                        <Card orientation="horizontal" variant="outlined" key={comment.user.id}>
                                            <CardOverflow>
                                                <AspectRatio ratio="1" sx={{ width: 90, paddingTop: 1 }}>
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
                                                <Typography level="body-sm">Comentarios: {comment.comments_count}</Typography>
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
        </AuthenticatedLayout>
    );
}
