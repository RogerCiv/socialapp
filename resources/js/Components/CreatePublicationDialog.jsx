import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { Textarea } from "@mui/joy";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import InputError from "@/Components/InputError";

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

export default function CreatePublicationDialog({ open, handleClose, submit, data, setData, errors, fileInputRef, processing, isEdit }) {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{isEdit ? "Editar Publicación" : "Crear Publicación"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {isEdit ? "Edite el contenido y/o imagen de la publicación." : "Para crear una nueva publicación, ingrese el contenido y/o seleccione una imagen."}
                </DialogContentText>
                <form id="publication-form" onSubmit={submit}>
                    <Textarea
                        color="primary"
                        minRows={4}
                        placeholder="Contenido de la Publicación"
                        size="lg"
                        variant="solid"
                        name="content"
                        id="content"
                        value={data.content}
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
                            Subir Imagen
                            <VisuallyHiddenInput type="file" name='image' id='image' ref={fileInputRef}
                                                 onChange={(e) => setData('image', e.target.files[0])} />
                        </Button>
                        {isEdit && data.image && !(data.image instanceof File) && (
                            <div className="mt-2">
                                <img
                                    src={data.image.startsWith('http') ? data.image : `/storage/${data.image}`}
                                    alt="Current Image"
                                    className="rounded-lg object-cover max-h-64"
                                />
                            </div>
                        )}
                        <InputError message={errors.image} className="mt-2" />
                    </div>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button type="submit" form="publication-form" disabled={processing}>
                    {isEdit ? "Guardar" : "Publicar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
