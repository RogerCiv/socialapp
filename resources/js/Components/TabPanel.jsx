import Box from "@mui/material/Box";


export default function  TabPanel(props) {
    const {children, value, index} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
        >
            {value === index && (
                <Box sx={{p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div style={{width: '100%'}}>{children}</div>
                </Box>
            )}
        </div>
    );
}
