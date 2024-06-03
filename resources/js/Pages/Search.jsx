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
import Avatar from "@mui/material/Avatar";

export default function Search({publications, users, auth, user}) {

    return (
        <>
            <AuthenticatedLayout user={auth.user}>
                <div className='flex flex-col justify-center md:max-w-6xl md:mx-auto p-4'>
                        <div className='flex flex-col justify-center items-center space-y-8'>
                            <h2 className='text-lg font-bold text-text-950'>Usuarios</h2>
                                    {users.length === 0 && <Typography fontWeight="md" textAlign='center'   sx={{ color: 'var(--text-800)'}}>No se encontraron usuarios...</Typography>}
                                <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={4}
                                     sx={{'@media (max-width: 868px)': {gridTemplateColumns: '1fr'}}}>
                                    {users.map((user) => (
                                        <Card orientation="horizontal" variant="outlined" key={user.id}
                                              sx={{borderRadius: 'xl', backgroundColor: 'var(--background-100)', borderColor: 'divider', borderWidth: 1}}>
                                            <CardOverflow>
                                                <AspectRatio ratio="1" sx={{width: 90, paddingTop: 2, borderRadius:'xl'}}>
                                                    <Avatar
                                                        alt={`${user.name} Avatar`}
                                                        src={user.avatar ? `/storage/${user.avatar}` : "/img/avatar_default.jpg"}
                                                        sx={{width: 56, height: 56 }}
                                                        className='border border-2 border-accent-500 hover:border-accent-300'
                                                    />
                                                </AspectRatio>
                                            </CardOverflow>
                                            <CardContent>
                                                <Typography fontWeight="md"  sx={{
                                                    color: 'var(--accent-500)',
                                                }}>
                                                    {user.name ? user.name : 'Unknown'}
                                                </Typography>
                                                <Typography level="body-sm"  sx={{
                                                    color: 'var(--text-950)',
                                                }}>Resultado:
                                                    #{users.indexOf(user) + 1}</Typography>
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
                                                    backgroundColor: 'var(--background-200)',
                                                }}>
                                                <Link href={route('profile', {name: user.name})}>
                                                    <Button sx={{
                                                        color: 'var(--text-950)',
                                                        fontSize: 'xs',
                                                        fontWeight: 'xl',
                                                        letterSpacing: '1px',
                                                        textTransform: 'uppercase',
                                                    }}>Ver Perfil</Button>
                                                </Link>
                                            </CardOverflow>
                                        </Card>
                                    ))}
                                </Box>
                        </div>

                    <div className='flex flex-col justify-center items-center space-y-6 mt-8'>
                        <h2 className='text-lg font-bold text-text-950'>Publicaciones</h2>
                        <div className='max-w-6xl space-y-6 px-4 md:px-0'>
                            {publications.length === 0 && <Typography fontWeight="md"  sx={{ color: 'var(--text-800)'}}>No se encontraron publicaciones...</Typography>}
                        {
                            publications.map((publication) => (
                                <CardPub publication={publication} key={publication.id} user={user}/>
                            ))
                        }
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>

        </>
    )
}
