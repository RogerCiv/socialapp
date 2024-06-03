import * as React from 'react';
import Button from '@mui/joy/Button';
import Snackbar from '@mui/joy/Snackbar';
import PlaylistAddCheckCircleRoundedIcon from '@mui/icons-material/PlaylistAddCheckCircleRounded';

export default function SnackbarWithDecorators({ message, open, onClose, color }) {
    return (
        <Snackbar
            variant="soft"
            color={color}
            open={open}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            startDecorator={<PlaylistAddCheckCircleRoundedIcon />}
            endDecorator={
                <Button
                    onClick={onClose}
                    size="sm"
                    variant="soft"
                    color={color}
                >
                    Dismiss
                </Button>
            }
        >
            {message}
        </Snackbar>
    );
}
