import {useEffect} from "react";
import Box from "@mui/material/Box";
import {Link} from "@inertiajs/react";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import AspectRatio from "@mui/joy/AspectRatio";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCrown} from "@fortawesome/free-solid-svg-icons";
import * as React from "react";
import CardPub from "@/Components/CardPub.jsx";

export default function Search({ props }) {
    const {  publications } = props;

    useEffect(() => {
        console.log(publications);
    }, [props]); // Obs
    return (
        <>
            <div className='grid-cols-1 sm:grid-cols-2'>
                <h1>Search</h1>
                <div>
                    <h2 className='text-lg font-bold'>Users</h2>
                    <div className='grid-cols-2'>
                        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={4}
                             sx={{'@media (max-width: 768px)': {gridTemplateColumns: '1fr'}}}>
                            {/*{users.data.map((user) => (*/}
                            {/*    <Link href={route('profile', {name: user.name})} key={user.id}>*/}
                            {/*        <Card orientation="horizontal" variant="outlined">*/}
                            {/*            <CardOverflow>*/}
                            {/*                <AspectRatio ratio="1" sx={{width: 90, paddingTop: 1}}>*/}
                            {/*                    <img*/}
                            {/*                        className="rounded-full w-24 h-24 mx-auto"*/}
                            {/*                        src={user.avatar ? `/storage/${user.avatar}` : '/img/avatar_default.jpg'}*/}
                            {/*                        alt=""*/}
                            {/*                    />*/}
                            {/*                </AspectRatio>*/}
                            {/*            </CardOverflow>*/}
                            {/*            <CardContent>*/}
                            {/*                <Typography fontWeight="md" textColor="success.plainColor">*/}
                            {/*                    {user.name ? user.name : 'Unknown'}*/}
                            {/*                </Typography>*/}
                            {/*                <Typography level="body-sm">Puesto #{users.indexOf(user) + 1}</Typography>*/}
                            {/*                /!* Asumiendo que tienes la propiedad publications_count en el modelo User *!/*/}
                            {/*                <Typography*/}
                            {/*                    level="body-sm">Publicaciones: {user.publications_count}</Typography>*/}
                            {/*            </CardContent>*/}
                            {/*            /!* Supongo que quieres mostrar la corona para los usuarios más populares *!/*/}
                            {/*            <CardOverflow*/}
                            {/*                variant="soft"*/}
                            {/*                color="primary"*/}
                            {/*                sx={{*/}
                            {/*                    px: 0.2,*/}
                            {/*                    writingMode: 'vertical-rl',*/}
                            {/*                    justifyContent: 'center',*/}
                            {/*                    fontSize: 'xs',*/}
                            {/*                    fontWeight: 'xl',*/}
                            {/*                    letterSpacing: '1px',*/}
                            {/*                    textTransform: 'uppercase',*/}
                            {/*                    borderLeft: '1px solid',*/}
                            {/*                    borderColor: 'divider',*/}
                            {/*                }}*/}
                            {/*            >*/}
                            {/*                <FontAwesomeIcon*/}
                            {/*                    icon={faCrown}*/}
                            {/*                    className={`absolute -top-2 right-0 h-8 w-8 ${crownColors[users.indexOf(user)]}`}*/}
                            {/*                    title={`Crown ${users.indexOf(user) + 1}`}*/}
                            {/*                />*/}
                            {/*            </CardOverflow>*/}
                            {/*        </Card>*/}
                            {/*    </Link>*/}
                            {/*))}*/}
                        </Box>
                    </div>
                </div>
            </div>

            <div>
                <h2 className='text-lg font-bold'>Publications</h2>
                {/*{*/}
                {/*    publications.map((publication) => (*/}
                {/*        <CardPub publication={publication} key={publication.id} user={user}/>*/}
                {/*    ))*/}
                {/*}*/}
            </div>
        </>
    )
}
