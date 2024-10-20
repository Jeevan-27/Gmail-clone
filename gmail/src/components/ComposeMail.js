import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Dialog, Box, InputBase, Button, MenuItem,
    IconButton, Typography, Paper, Tooltip, FormControlLabel, Checkbox
} from '@mui/material';
import { Close, DeleteOutline, AttachFile } from '@mui/icons-material';
import { EditorState } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createToolbarPlugin from 'draft-js-static-toolbar-plugin';
import 'draft-js-static-toolbar-plugin/lib/plugin.css';
import { stateToHTML } from 'draft-js-export-html';
import axios from 'axios';

const toolbarPlugin = createToolbarPlugin();
const { Toolbar } = toolbarPlugin;
const plugins = [toolbarPlugin];

const dialogStyle = {
    height: '90%',
    width: '80%',
    maxWidth: '100%',
    maxHeight: '100%',
    boxShadow: 'none',
    borderRadius: '10px 10px 0 0',
};

const exampleGroups = [
    { name: 'Group 1', emails: ['email1@example.com', 'email2@example.com'] },
    { name: 'Group 2', emails: ['email3@example.com', 'email4@example.com'] },
    { name: 'Group 3', emails: ['email5@example.com', 'email6@example.com'] },
    { name: 'Group 4', emails: ['email7@example.com', 'email8@example.com'] }
];

const ComposeMail = ({ open, setOpenDrawer, isDarkTheme }) => {
    const [loggedInUserEmail, setLoggedInUserEmail] = useState('');
    const [data, setData] = useState({});
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [attachments, setAttachments] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.email) {
            setLoggedInUserEmail(user.email);
            setData(prevData => ({ ...prevData, from: user.email }));
        }
    }, []);

    const theme = {
        backgroundColor: isDarkTheme ? '#1a1a1a' : '#ffffff',
        textColor: isDarkTheme ? '#ffffff' : '#000000',
        inputBackgroundColor: isDarkTheme ? '#333333' : '#f2f6fc',
        borderColor: isDarkTheme ? '#444444' : '#cccccc',
        hoverColor: isDarkTheme ? '#2c2c2c' : '#e6e6e6',
    };

    const onValueChange = useCallback((e) => {
        if (e.target.name === 'to') {
            const inputEmails = e.target.value.split(',').map(email => email.trim());
            const selectedEmails = exampleGroups
                .filter(group => selectedGroups.includes(group.name))
                .flatMap(group => group.emails);

            const allEmails = Array.from(new Set([...inputEmails, ...selectedEmails]));
            setData(prevData => ({ ...prevData, [e.target.name]: allEmails.join(', ') }));
        } else {
            setData(prevData => ({ ...prevData, [e.target.name]: e.target.value }));
        }
    }, [selectedGroups]);

    const handleGroupSelection = useCallback((groupName) => {
        setSelectedGroups(prevGroups => {
            const updatedGroups = prevGroups.includes(groupName)
                ? prevGroups.filter(group => group !== groupName)
                : [...prevGroups, groupName];
    
            const typedEmails = data.to ? data.to.split(',').map(email => email.trim()) : [];
            const selectedEmails = exampleGroups
                .filter(group => updatedGroups.includes(group.name))
                .flatMap(group => group.emails);
    
            const removedEmails = prevGroups.includes(groupName) 
                ? exampleGroups.find(group => group.name === groupName)?.emails || [] 
                : [];
    
            const allEmails = Array.from(new Set([
                ...typedEmails.filter(email => !removedEmails.includes(email)),
                ...selectedEmails
            ]));
    
            setData(prevData => ({ ...prevData, to: allEmails.join(', ') }));
    
            return updatedGroups;
        });
    }, [data.to]);

    const handleEditorChange = useCallback((state) => {
        setEditorState(state);
        const contentState = state.getCurrentContent();
        const bodyText = stateToHTML(contentState);
        setData(prevData => ({ ...prevData, body: bodyText }));
    }, []);

    const handleFileUpload = useCallback((event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const newAttachments = Array.from(files).map(file => file.name);
            setAttachments(prevAttachments => [...prevAttachments, ...newAttachments]);
        }
    }, []);

    const removeAttachment = useCallback((fileName) => {
        setAttachments(prevAttachments => prevAttachments.filter(file => file !== fileName));
    }, []);

    const sendEmail = async () => {
        try {
            const emailData = {
                to: data.to,
                from: loggedInUserEmail,
                cc: data.cc,
                bcc: data.bcc,
                subject: data.subject,
                body: data.body,
                date: new Date(),
                attachments: attachments,
            };

            console.log("Attempting to send email with data:", emailData);

            const response = await axios.post(`http://localhost:1973/api/send`, emailData);

            console.log('Response from server:', response.data);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    const saveAsDraft = useCallback(async () => {
        try {
            const draftData = {
                to: data.to,
                from: loggedInUserEmail,
                cc: data.cc,
                bcc: data.bcc,
                subject: data.subject,
                body: data.body,
                attachments: attachments,
            };

            console.log('Attempting to save draft with data:', draftData);
            const response = await axios.post('http://localhost:1973/api/drafts', draftData);
            console.log('Response from server:', response.data);
        } catch (error) {
            console.error('Error saving draft:', error);
        }
    }, [data, attachments, loggedInUserEmail]);

    const clearAllFields = useCallback(() => {
        setData({
            to: '',
            cc: '',
            bcc: '',
            subject: '',
            body: '',
            from: loggedInUserEmail
        });
        setEditorState(EditorState.createEmpty());
        setAttachments([]);
        setShowDropdown(false);
        setSelectedGroups([]);
        setOpenDrawer(false);
    }, [loggedInUserEmail]);

    const memoizedToolbar = useMemo(() => <Toolbar />, []);

    return (
        <Dialog 
            open={open} 
            PaperProps={{ 
                sx: { 
                    ...dialogStyle, 
                    backgroundColor: theme.backgroundColor,
                    color: theme.textColor
                } 
            }}
        >
            <Box display="flex" flexDirection="column" height="100%" sx={{backgroundColor: theme.backgroundColor}}>
                <Box display="flex" justifyContent="space-between" padding="5px 10px" position="relative" bgcolor={theme.backgroundColor}>
                    <Typography variant="subtitle1" style={{ fontSize: '1rem', color: theme.textColor }}>New Message</Typography>
                    <IconButton onClick={() => { setOpenDrawer(false); clearAllFields(); }} sx={{color: theme.textColor}}>
                        <Close fontSize="small" />
                    </IconButton>
                </Box>
    
                <Box padding="0 15px">
                    <Box position="relative">
                        <InputBase
                            placeholder='Recipients'
                            name="to"
                            onChange={onValueChange}
                            value={data.to || ''}
                            fullWidth
                            sx={{ 
                                color: theme.textColor, 
                                bgcolor: theme.inputBackgroundColor,
                                '&::placeholder': { color: theme.textColor },
                                padding: '5px',
                                marginBottom: '5px'
                            }}
                            onClick={() => setShowDropdown(prev => !prev)}
                        />
                        {showDropdown && (
                            <Box sx={{
                                position: 'absolute',
                                zIndex: 1,
                                backgroundColor: theme.backgroundColor,
                                border: `1px solid ${theme.borderColor}`,
                                borderRadius: '4px',
                                marginTop: '2px',
                                maxHeight: '170px',
                                overflowY: 'auto',
                                width: '100%'
                            }}>
                                <Typography variant="subtitle2" sx={{ padding: '5px', fontWeight: 'bold', fontSize: '13px', color: theme.textColor }}>
                                Select Groups
                                </Typography>
                                {exampleGroups.map((group, index) => (
                                    <MenuItem key={index} sx={{
                                        '&:hover': { backgroundColor: theme.hoverColor },
                                    }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={selectedGroups.includes(group.name)}
                                                    onChange={() => handleGroupSelection(group.name)}
                                                    sx={{
                                                        color: theme.textColor,
                                                        '&.Mui-checked': {
                                                            color: theme.textColor,
                                                        },
                                                    }}
                                                />
                                            }
                                            label={group.name}
                                            sx={{ '& .MuiTypography-root': { fontSize: '14px', color: theme.textColor } }}
                                        />
                                    </MenuItem>
                                ))}
                            </Box>
                        )}
                    </Box>
                    <InputBase placeholder='Cc' name="cc" onChange={onValueChange} value={data.cc || ''} fullWidth 
                        sx={{ 
                            color: theme.textColor, 
                            bgcolor: theme.inputBackgroundColor,
                            '&::placeholder': { color: theme.textColor },
                            padding: '5px',
                            marginBottom: '5px'
                        }}
                    />
                    <InputBase placeholder='Bcc' name="bcc" onChange={onValueChange} value={data.bcc || ''} fullWidth 
                        sx={{ 
                            color: theme.textColor, 
                            bgcolor: theme.inputBackgroundColor,
                            '&::placeholder': { color: theme.textColor },
                            padding: '5px',
                            marginBottom: '5px'
                        }}
                    />
                    <InputBase placeholder='Subject' name="subject" onChange={onValueChange} value={data.subject || ''} fullWidth 
                        sx={{ 
                            color: theme.textColor, 
                            bgcolor: theme.inputBackgroundColor,
                            '&::placeholder': { color: theme.textColor },
                            padding: '5px',
                            marginBottom: '5px'
                        }}
                    />
                </Box>

                <Box flex="1" padding="15px" overflow="auto" sx={{backgroundColor: theme.backgroundColor}}>
                    {memoizedToolbar}
                    <Paper variant="outlined" style={{ padding: '10px', minHeight: '300px', backgroundColor: theme.inputBackgroundColor, color: theme.textColor}}>
                        <Editor
                            editorState={editorState}
                            onChange={handleEditorChange}
                            plugins={plugins}
                        />
                    </Paper>
                </Box>

                {attachments.length > 0 && (
                    <Box padding="10px">
                        {attachments.map((file, index) => (
                            <Box key={index} display="flex" alignItems="center" justifyContent="space-between" bgcolor={theme.inputBackgroundColor} padding="5px" borderRadius="5px" marginBottom="5px">
                                <Typography variant="body2" sx={{ color: theme.textColor }}>{file}</Typography>
                                <IconButton onClick={() => removeAttachment(file)} size="small" sx={{ color: theme.textColor }}> 
                                    <DeleteOutline fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                )}

                <Box display="flex" justifyContent="space-between" padding="10px 15px" alignItems="center" sx={{backgroundColor: theme.backgroundColor}}>
                    <Box display="flex" alignItems="center">
                        <Button variant="contained" color="primary" onClick={()=> {sendEmail(); setOpenDrawer(false); clearAllFields();}}>Send</Button>
                        <Tooltip title="Attach file">
                            <IconButton component="label" sx={{color: theme.textColor}}>
                                <AttachFile />
                                <input type="file" hidden multiple onChange={handleFileUpload} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Button onClick={saveAsDraft} sx={{ marginRight: '10px' }}>Save Draft</Button>
                        <Tooltip title="Clear all fields">
                            <IconButton onClick={clearAllFields} sx={{color: theme.textColor}}>
                                <DeleteOutline />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
};

export default ComposeMail;