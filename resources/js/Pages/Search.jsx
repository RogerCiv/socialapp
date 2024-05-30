import {useEffect} from "react";
import Box from "@mui/material/Box";
import {Link} from "@inertiajs/react";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import AspectRatio from "@mui/joy/AspectRatio";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import * as React from "react";
import Button from "@mui/material/Button";
import CardPub from "@/Components/CardPub.jsx";

export default function Search({publications, users, auth, user}) {
    // const {  publications } = props;
    const crownColors = ["text-yellow-500", "text-slate-500", "text-[#bf8970] "];

    useEffect(() => {
        // console.log(publications.map((publication) => publication));
        // console.log(users.map((user) => user))
    }, [publications]); // Obs
    return (
        <>
            <AuthenticatedLayout user={auth.user}>
                <div className='flex flex-col justify-center md:max-w-6xl md:mx-auto p-4'>
                    <div className='grid-cols-1 sm:grid-cols-2  space-y-6'>
                        <h1>Search</h1>
                        <div className='space-y-6'>
                            <h2 className='text-lg font-bold'>Users</h2>

                                <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={4}
                                     sx={{'@media (max-width: 768px)': {gridTemplateColumns: '1fr'}}}>
                                    {users.map((user) => (

                                        <Card orientation="horizontal" variant="outlined" key={user.id}>
                                            <CardOverflow>
                                                <AspectRatio ratio="1" sx={{width: 90, paddingTop: 1}}>
                                                    <img
                                                        className="rounded-full w-24 h-24 mx-auto"
                                                        src={user.avatar ? `/storage/${user.avatar}` : '/img/avatar_default.jpg'}
                                                        alt=""
                                                    />
                                                </AspectRatio>
                                            </CardOverflow>
                                            <CardContent>
                                                <Typography fontWeight="md" textColor="success.plainColor">
                                                    {user.name ? user.name : 'Unknown'}
                                                </Typography>
                                                <Typography level="body-sm">Resultado:
                                                    #{users.indexOf(user) + 1}</Typography>
                                                {/* Asumiendo que tienes la propiedad publications_count en el modelo User */}

                                            </CardContent>
                                            {/* Supongo que quieres mostrar la corona para los usuarios más populares */}
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
                                                }}>
                                                <Link href={route('profile', {name: user.name})}>
                                                    <Button>Ver Perfil</Button>
                                                </Link>
                                            </CardOverflow>
                                        </Card>
                                    ))}
                                </Box>

                        </div>
                    </div>

                    <div className=''>
                        <h2 className='text-lg font-bold'>Publications</h2>
                        {
                            publications.map((publication) => (
                                <CardPub publication={publication} key={publication.id} user={user}/>
                            ))
                        }
                    </div>
                </div>
            </AuthenticatedLayout>

        </>
    )
}
