// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import {
//     Dialog, Box, InputBase, Button, MenuItem,
//     IconButton, Typography, Paper, Tooltip, FormControlLabel, Checkbox
// } from '@mui/material';
// import { Close, DeleteOutline, AttachFile } from '@mui/icons-material';
// import { EditorState } from 'draft-js';
// import Editor from 'draft-js-plugins-editor';
// import createToolbarPlugin from 'draft-js-static-toolbar-plugin';
// import 'draft-js-static-toolbar-plugin/lib/plugin.css';
// import { stateToHTML } from 'draft-js-export-html';
// import axios from 'axios';

// const toolbarPlugin = createToolbarPlugin();
// const { Toolbar } = toolbarPlugin;
// const plugins = [toolbarPlugin];

// const dialogStyle = {
//     height: '90%',
//     width: '80%',
//     maxWidth: '100%',
//     maxHeight: '100%',
//     boxShadow: 'none',
//     borderRadius: '10px 10px 0 0',
// };

// const ComposeMail = ({ open, setOpenDrawer, isDarkTheme }) => {
//     const [loggedInUserEmail, setLoggedInUserEmail] = useState('');
//     const [data, setData] = useState({});
//     const [selectedGroups, setSelectedGroups] = useState([]);
//     const [editorState, setEditorState] = useState(EditorState.createEmpty());
//     const [attachments, setAttachments] = useState([]);
//     const [showDropdown, setShowDropdown] = useState(false);
//     const [userGroups, setUserGroups] = useState([]);

//     useEffect(() => {
//         const user = JSON.parse(localStorage.getItem('user'));
//         if (user?.email) {
//             setLoggedInUserEmail(user.email);
//             setData(prevData => ({ ...prevData, from: user.email }));
//         }
//     }, []);

//     // Fetch groups from the database based on logged-in user's email
//     useEffect(() => {
//         const fetchGroups = async () => {
//             try {
//                 const response = await axios.post('http://localhost:1973/api/groups/fetch-groups', {
//                     emailId: loggedInUserEmail, // Send emailId to fetch groups
//                 });
//                 setUserGroups(response.data);
//             } catch (error) {
//                 console.error('Error fetching groups:', error);
//             }
//         };

//         if (loggedInUserEmail) {
//             fetchGroups();
//         }
//     }, [loggedInUserEmail]);

//     const theme = {
//         backgroundColor: isDarkTheme ? '#1a1a1a' : '#ffffff',
//         textColor: isDarkTheme ? '#ffffff' : '#000000',
//         inputBackgroundColor: isDarkTheme ? '#333333' : '#f2f6fc',
//         borderColor: isDarkTheme ? '#444444' : '#cccccc',
//         hoverColor: isDarkTheme ? '#2c2c2c' : '#e6e6e6',
//     };

//     const onValueChange = useCallback((e) => {
//         if (e.target.name === 'to') {
//             const inputEmails = e.target.value.split(',').map(email => email.trim());
//             const selectedEmails = userGroups
//                 .filter(group => selectedGroups.includes(group.groupName))
//                 .flatMap(group => group.members);

//             const allEmails = Array.from(new Set([...inputEmails, ...selectedEmails]));
//             setData(prevData => ({ ...prevData, [e.target.name]: allEmails.join(', ') }));
//         } else {
//             setData(prevData => ({ ...prevData, [e.target.name]: e.target.value }));
//         }
//     }, [selectedGroups, userGroups]);

//     const handleGroupSelection = useCallback((groupName) => {
//         setSelectedGroups(prevGroups => {
//             const updatedGroups = prevGroups.includes(groupName)
//                 ? prevGroups.filter(group => group !== groupName)
//                 : [...prevGroups, groupName];
    
//             const typedEmails = data.to ? data.to.split(',').map(email => email.trim()) : [];
//             const selectedEmails = userGroups
//                 .filter(group => updatedGroups.includes(group.groupName))
//                 .flatMap(group => group.members);
    
//             const removedEmails = prevGroups.includes(groupName) 
//                 ? userGroups.find(group => group.groupName === groupName)?.members || [] 
//                 : [];
    
//             const allEmails = Array.from(new Set([
//                 ...typedEmails.filter(email => !removedEmails.includes(email)),
//                 ...selectedEmails
//             ]));
    
//             setData(prevData => ({ ...prevData, to: allEmails.join(', ') }));
    
//             return updatedGroups;
//         });
//     }, [data.to, userGroups]);

//     const handleEditorChange = useCallback((state) => {
//         setEditorState(state);
//         const contentState = state.getCurrentContent();
//         const bodyText = stateToHTML(contentState);
//         setData(prevData => ({ ...prevData, body: bodyText }));
//     }, []);

//     const handleFileUpload = useCallback((event) => {
//         const files = event.target.files;
//         if (files.length > 0) {
//             const newAttachments = Array.from(files).map(file => file.name);
//             setAttachments(prevAttachments => [...prevAttachments, ...newAttachments]);
//         }
//     }, []);

//     const removeAttachment = useCallback((fileName) => {
//         setAttachments(prevAttachments => prevAttachments.filter(file => file !== fileName));
//     }, []);

//     const sendEmail = async () => {
//         try {
//             const emailData = {
//                 to: data.to,
//                 from: loggedInUserEmail,
//                 cc: data.cc,
//                 bcc: data.bcc,
//                 subject: data.subject,
//                 body: data.body,
//                 date: new Date(),
//                 attachments: attachments,
//             };

//             console.log("Attempting to send email with data:", emailData);

//             const response = await axios.post(`http://localhost:1973/api/send`, emailData);

//             console.log('Response from server:', response.data);
//         } catch (error) {
//             console.error('Error sending email:', error);
//         }
//     };

//     const saveAsDraft = useCallback(async () => {
//         try {
//             const draftData = {
//                 to: data.to,
//                 from: loggedInUserEmail,
//                 cc: data.cc,
//                 bcc: data.bcc,
//                 subject: data.subject,
//                 body: data.body,
//                 attachments: attachments,
//             };

//             console.log('Attempting to save draft with data:', draftData);
//             const response = await axios.post('http://localhost:1973/api/drafts', draftData);
//             console.log('Response from server:', response.data);
//         } catch (error) {
//             console.error('Error saving draft:', error);
//         }
//     }, [data, attachments, loggedInUserEmail]);

//     const clearAllFields = useCallback(() => {
//         setData({
//             to: '',
//             cc: '',
//             bcc: '',
//             subject: '',
//             body: '',
//             from: loggedInUserEmail
//         });
//         setEditorState(EditorState.createEmpty());
//         setAttachments([]);
//         setShowDropdown(false);
//         setSelectedGroups([]);
//         setOpenDrawer(false);
//     }, [loggedInUserEmail]);

//     const memoizedToolbar = useMemo(() => <Toolbar />, []);

//     return (
//         <Dialog 
//             open={open} 
//             PaperProps={{ 
//                 sx: { 
//                     ...dialogStyle, 
//                     backgroundColor: theme.backgroundColor,
//                     color: theme.textColor
//                 } 
//             }}
//         >
//             <Box display="flex" flexDirection="column" height="100%" sx={{backgroundColor: theme.backgroundColor}}>
//                 <Box display="flex" justifyContent="space-between" padding="5px 10px" position="relative" bgcolor={theme.backgroundColor}>
//                     <Typography variant="subtitle1" style={{ fontSize: '1rem', color: theme.textColor }}>New Message</Typography>
//                     <IconButton onClick={() => { setOpenDrawer(false); clearAllFields(); }} sx={{color: theme.textColor}}>
//                         <Close fontSize="small" />
//                     </IconButton>
//                 </Box>
    
//                 <Box padding="0 15px">
//                     <Box position="relative">
//                         <InputBase
//                             placeholder='Recipients'
//                             name="to"
//                             onChange={onValueChange}
//                             value={data.to || ''}
//                             fullWidth
//                             sx={{ 
//                                 color: theme.textColor, 
//                                 bgcolor: theme.inputBackgroundColor,
//                                 '&::placeholder': { color: theme.textColor },
//                                 padding: '5px',
//                                 marginBottom: '5px'
//                             }}
//                             onClick={() => setShowDropdown(prev => !prev)}
//                         />
//                         {showDropdown && (
//                             <Box sx={{
//                                 position: 'absolute',
//                                 zIndex: 1,
//                                 backgroundColor: theme.backgroundColor,
//                                 border: '1px solid ${theme.borderColor}',
//                                 borderRadius: '4px',
//                                 marginTop: '2px',
//                                 maxHeight: '170px',
//                                 overflowY: 'auto',
//                                 width: '100%'
//                             }}>
//                                 <Typography variant="subtitle2" sx={{ padding: '5px', fontWeight: 'bold', fontSize: '13px', color: theme.textColor }}>
//                                 Select Groups
//                                 </Typography>
//                                 {userGroups.map((group, index) => (
//                                     <MenuItem key={index} sx={{
//                                         '&:hover': { backgroundColor: theme.hoverColor },
//                                     }}>
//                                         <FormControlLabel
//                                             control={
//                                                 <Checkbox
//                                                     checked={selectedGroups.includes(group.groupName)}
//                                                     onChange={() => handleGroupSelection(group.groupName)}
//                                                     sx={{color: theme.textColor}}
//                                                 />
//                                             }
//                                             label={<Typography sx={{ fontSize: '13px', color: theme.textColor }}>{group.groupName}</Typography>}
//                                         />
//                                     </MenuItem>
//                                 ))}
//                             </Box>
//                         )}
//                     </Box>
//                     <InputBase placeholder='Cc' name="cc" onChange={onValueChange} value={data.cc || ''} fullWidth 
//                         sx={{ 
//                             color: theme.textColor, 
//                             bgcolor: theme.inputBackgroundColor,
//                             '&::placeholder': { color: theme.textColor },
//                             padding: '5px',
//                             marginBottom: '5px'
//                         }}
//                     />
//                     <InputBase placeholder='Bcc' name="bcc" onChange={onValueChange} value={data.bcc || ''} fullWidth 
//                         sx={{ 
//                             color: theme.textColor, 
//                             bgcolor: theme.inputBackgroundColor,
//                             '&::placeholder': { color: theme.textColor },
//                             padding: '5px',
//                             marginBottom: '5px'
//                         }}
//                     />
//                     <InputBase placeholder='Subject' name="subject" onChange={onValueChange} value={data.subject || ''} fullWidth 
//                         sx={{ 
//                             color: theme.textColor, 
//                             bgcolor: theme.inputBackgroundColor,
//                             '&::placeholder': { color: theme.textColor },
//                             padding: '5px',
//                             marginBottom: '5px'
//                         }}
//                     />
//                 </Box>

//                 <Box flex="1" padding="15px" overflow="auto" sx={{backgroundColor: theme.backgroundColor}}>
//                     {memoizedToolbar}
//                     <Paper variant="outlined" style={{ padding: '10px', minHeight: '300px', backgroundColor: theme.inputBackgroundColor, color: theme.textColor}}>
//                         <Editor
//                             editorState={editorState}
//                             onChange={handleEditorChange}
//                             plugins={plugins}
//                         />
//                     </Paper>
//                 </Box>

//                 {attachments.length > 0 && (
//                     <Box padding="10px">
//                         {attachments.map((file, index) => (
//                             <Box key={index} display="flex" alignItems="center" justifyContent="space-between" bgcolor={theme.inputBackgroundColor} padding="5px" borderRadius="5px" marginBottom="5px">
//                                 <Typography variant="body2" sx={{ color: theme.textColor }}>{file}</Typography>
//                                 <IconButton onClick={() => removeAttachment(file)} size="small" sx={{ color: theme.textColor }}> 
//                                     <DeleteOutline fontSize="small" />
//                                 </IconButton>
//                             </Box>
//                         ))}
//                     </Box>
//                 )}

//                 <Box display="flex" justifyContent="space-between" padding="10px 15px" alignItems="center" sx={{backgroundColor: theme.backgroundColor}}>
//                     <Box display="flex" alignItems="center">
//                         <Button variant="contained" color="primary" onClick={()=> {sendEmail(); setOpenDrawer(false); clearAllFields();}}>Send</Button>
//                         <Tooltip title="Attach file">
//                             <IconButton component="label" sx={{color: theme.textColor}}>
//                                 <AttachFile />
//                                 <input type="file" hidden multiple onChange={handleFileUpload} />
//                             </IconButton>
//                         </Tooltip>
//                     </Box>
//                     <Box display="flex" alignItems="center">
//                         <Button onClick={saveAsDraft} sx={{ marginRight: '10px' }}>Save Draft</Button>
//                         <Tooltip title="Clear all fields">
//                             <IconButton onClick={clearAllFields} sx={{color: theme.textColor}}>
//                                 <DeleteOutline />
//                             </IconButton>
//                         </Tooltip>
//                     </Box>
//                 </Box>
//             </Box>
//         </Dialog>
//     );
// };

// export default ComposeMail;


// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import {
//     Dialog, Box, InputBase, Button, MenuItem,
//     IconButton, Typography, Paper, Tooltip, FormControlLabel, Checkbox
// } from '@mui/material';
// import { Close, DeleteOutline, AttachFile } from '@mui/icons-material';
// import { EditorState } from 'draft-js';
// import Editor from 'draft-js-plugins-editor';
// import createToolbarPlugin from 'draft-js-static-toolbar-plugin';
// import 'draft-js-static-toolbar-plugin/lib/plugin.css';
// import { stateToHTML } from 'draft-js-export-html';
// import axios from 'axios';

// const toolbarPlugin = createToolbarPlugin();
// const { Toolbar } = toolbarPlugin;
// const plugins = [toolbarPlugin];

// const dialogStyle = {
//     height: '90%',
//     width: '80%',
//     maxWidth: '100%',
//     maxHeight: '100%',
//     boxShadow: 'none',
//     borderRadius: '10px 10px 0 0',
// };

// const ComposeMail = ({ open, setOpenDrawer, isDarkTheme }) => {
//     const [loggedInUserEmail, setLoggedInUserEmail] = useState('');
//     const [data, setData] = useState({});
//     const [selectedGroups, setSelectedGroups] = useState([]);
//     const [editorState, setEditorState] = useState(EditorState.createEmpty());
//     const [attachments, setAttachments] = useState([]);
//     const [showDropdown, setShowDropdown] = useState(false);
//     const [userGroups, setUserGroups] = useState([]);

//     useEffect(() => {
//         const user = JSON.parse(localStorage.getItem('user'));
//         if (user?.email) {
//             setLoggedInUserEmail(user.email);
//             setData(prevData => ({ ...prevData, from: user.email }));
//         }
//     }, []);

//     // Fetch groups from the database based on logged-in user's email
//     useEffect(() => {
//         const fetchGroups = async () => {
//             try {
//                 const response = await axios.post('http://localhost:1973/api/groups/fetch-groups', {
//                     emailId: loggedInUserEmail, // Send emailId to fetch groups
//                 });
//                 setUserGroups(response.data);
//             } catch (error) {
//                 console.error('Error fetching groups:', error);
//             }
//         };

//         if (loggedInUserEmail) {
//             fetchGroups();
//         }
//     }, [loggedInUserEmail]);

//     const theme = {
//         backgroundColor: isDarkTheme ? '#1a1a1a' : '#ffffff',
//         textColor: isDarkTheme ? '#ffffff' : '#000000',
//         inputBackgroundColor: isDarkTheme ? '#333333' : '#f2f6fc',
//         borderColor: isDarkTheme ? '#444444' : '#cccccc',
//         hoverColor: isDarkTheme ? '#2c2c2c' : '#e6e6e6',
//     };

//     const onValueChange = useCallback((e) => {
//         if (e.target.name === 'to') {
//             const inputEmails = e.target.value.split(',').map(email => email.trim());
//             const selectedEmails = userGroups
//                 .filter(group => selectedGroups.includes(group.groupName))
//                 .flatMap(group => group.members);

//             const allEmails = Array.from(new Set([...inputEmails, ...selectedEmails]));
//             setData(prevData => ({ ...prevData, [e.target.name]: allEmails.join(', ') }));
//         } else {
//             setData(prevData => ({ ...prevData, [e.target.name]: e.target.value }));
//         }
//     }, [selectedGroups, userGroups]);

//     // const handleGroupSelection = useCallback((groupName) => {
//     //     setSelectedGroups(prevGroups => {
//     //         const updatedGroups = prevGroups.includes(groupName)
//     //             ? prevGroups.filter(group => group !== groupName)
//     //             : [...prevGroups, groupName];
    
//     //         const typedEmails = data.to ? data.to.split(',').map(email => email.trim()) : [];
//     //         const selectedEmails = userGroups
//     //             .filter(group => updatedGroups.includes(group.groupName))
//     //             .flatMap(group => group.members);
    
//     //         const removedEmails = prevGroups.includes(groupName) 
//     //             ? userGroups.find(group => group.groupName === groupName)?.members || [] 
//     //             : [];
    
//     //         const allEmails = Array.from(new Set([
//     //             ...typedEmails.filter(email => !removedEmails.includes(email)),
//     //             ...selectedEmails
//     //         ]));
    
//     //         setData(prevData => ({ ...prevData, to: allEmails.join(', ') }));
    
//     //         return updatedGroups;
//     //     });
//     // }, [data.to, userGroups]);

//     const handleGroupSelection = useCallback((groupName) => {
//         setSelectedGroups(prevGroups => {
//             const updatedGroups = prevGroups.includes(groupName)
//                 ? prevGroups.filter(group => group !== groupName)
//                 : [...prevGroups, groupName];

//             const typedEmails = data.to ? data.to.split(',').map(email => email.trim()) : [];
//             const selectedEmails = userGroups
//                 .filter(group => updatedGroups.includes(group.groupName))
//                 .flatMap(group => group.members)
//                 .filter(email => email !== loggedInUserEmail); // Exclude logged-in user's email

//             const removedEmails = prevGroups.includes(groupName)
//                 ? userGroups.find(group => group.groupName === groupName)?.members || []
//                 : [];

//             const allEmails = Array.from(new Set([
//                 ...typedEmails.filter(email => !removedEmails.includes(email)),
//                 ...selectedEmails
//             ]));

//             setData(prevData => ({ ...prevData, to: allEmails.join(', ') }));

//             return updatedGroups;
//         });
//     }, [data.to, userGroups, loggedInUserEmail]);

//     const handleEditorChange = useCallback((state) => {
//         setEditorState(state);
//         const contentState = state.getCurrentContent();
//         const bodyText = stateToHTML(contentState);
//         setData(prevData => ({ ...prevData, body: bodyText }));
//     }, []);

//     const handleFileUpload = useCallback((event) => {
//         const files = event.target.files;
//         if (files.length > 0) {
//             const newAttachments = Array.from(files).map(file => file.name);
//             setAttachments(prevAttachments => [...prevAttachments, ...newAttachments]);
//         }
//     }, []);

//     const removeAttachment = useCallback((fileName) => {
//         setAttachments(prevAttachments => prevAttachments.filter(file => file !== fileName));
//     }, []);

//     const sendEmail = async () => {
//         try {
//             const emailData = {
//                 to: data.to,
//                 from: loggedInUserEmail,
//                 cc: data.cc,
//                 bcc: data.bcc,
//                 subject: data.subject,
//                 body: data.body,
//                 date: new Date(),
//                 attachments: attachments,
//             };

//             console.log("Attempting to send email with data:", emailData);

//             const response = await axios.post(`http://localhost:1973/api/send`, emailData);
//             //const response=await axios.post('http://localhost:1973/api/inbox/send', emailData);

//             console.log('Response from server:', response.data);
//         } catch (error) {
//             console.error('Error sending email:', error);
//         }
//     };

//     const saveAsDraft = useCallback(async () => {
//         try {
//             const draftData = {
//                 to: data.to,
//                 from: loggedInUserEmail,
//                 cc: data.cc,
//                 bcc: data.bcc,
//                 subject: data.subject,
//                 body: data.body,
//                 attachments: attachments,
//             };

//             console.log('Attempting to save draft with data:', draftData);
//             const response = await axios.post('http://localhost:1973/api/drafts', draftData);
//             console.log('Response from server:', response.data);
//         } catch (error) {
//             console.error('Error saving draft:', error);
//         }
//     }, [data, attachments, loggedInUserEmail]);

//     const clearAllFields = useCallback(() => {
//         setData({
//             to: '',
//             cc: '',
//             bcc: '',
//             subject: '',
//             body: '',
//             from: loggedInUserEmail
//         });
//         setEditorState(EditorState.createEmpty());
//         setAttachments([]);
//         setShowDropdown(false);
//         setSelectedGroups([]);
//         setOpenDrawer(false);
//     }, [loggedInUserEmail]);

//     const memoizedToolbar = useMemo(() => <Toolbar />, []);

//     return (
//         <Dialog 
//             open={open} 
//             PaperProps={{ 
//                 sx: { 
//                     ...dialogStyle, 
//                     backgroundColor: theme.backgroundColor,
//                     color: theme.textColor
//                 } 
//             }}
//         >
//             <Box display="flex" flexDirection="column" height="100%" sx={{backgroundColor: theme.backgroundColor}}>
//                 <Box display="flex" justifyContent="space-between" padding="5px 10px" position="relative" bgcolor={theme.backgroundColor}>
//                     <Typography variant="subtitle1" style={{ fontSize: '1rem', color: theme.textColor }}>New Message</Typography>
//                     <IconButton onClick={() => { setOpenDrawer(false); clearAllFields(); }} sx={{color: theme.textColor}}>
//                         <Close fontSize="small" />
//                     </IconButton>
//                 </Box>
    
//                 <Box padding="0 15px">
//                     <Box position="relative">
//                         <InputBase
//                             placeholder='Recipients'
//                             name="to"
//                             onChange={onValueChange}
//                             value={data.to || ''}
//                             fullWidth
//                             sx={{ 
//                                 color: theme.textColor, 
//                                 bgcolor: theme.inputBackgroundColor,
//                                 '&::placeholder': { color: theme.textColor },
//                                 padding: '5px',
//                                 marginBottom: '5px'
//                             }}
//                             onClick={() => setShowDropdown(prev => !prev)}
//                         />
//                         {showDropdown && (
//                             <Box sx={{
//                                 position: 'absolute',
//                                 zIndex: 1,
//                                 backgroundColor: theme.backgroundColor,
//                                 border: '1px solid ${theme.borderColor}',
//                                 borderRadius: '4px',
//                                 marginTop: '2px',
//                                 maxHeight: '170px',
//                                 overflowY: 'auto',
//                                 width: '100%'
//                             }}>
//                                 <Typography variant="subtitle2" sx={{ padding: '5px', fontWeight: 'bold', fontSize: '13px', color: theme.textColor }}>
//                                 Select Groups
//                                 </Typography>
//                                 {userGroups.map((group, index) => (
//                                     <MenuItem key={index} sx={{
//                                         '&:hover': { backgroundColor: theme.hoverColor },
//                                     }}>
//                                         <FormControlLabel
//                                             control={
//                                                 <Checkbox
//                                                     checked={selectedGroups.includes(group.groupName)}
//                                                     onChange={() => handleGroupSelection(group.groupName)}
//                                                     sx={{color: theme.textColor}}
//                                                 />
//                                             }
//                                             label={<Typography sx={{ fontSize: '13px', color: theme.textColor }}>{group.groupName}</Typography>}
//                                         />
//                                     </MenuItem>
//                                 ))}
//                             </Box>
//                         )}
//                     </Box>
//                     <InputBase placeholder='Cc' name="cc" onChange={onValueChange} value={data.cc || ''} fullWidth 
//                         sx={{ 
//                             color: theme.textColor, 
//                             bgcolor: theme.inputBackgroundColor,
//                             '&::placeholder': { color: theme.textColor },
//                             padding: '5px',
//                             marginBottom: '5px'
//                         }}
//                     />
//                     <InputBase placeholder='Bcc' name="bcc" onChange={onValueChange} value={data.bcc || ''} fullWidth 
//                         sx={{ 
//                             color: theme.textColor, 
//                             bgcolor: theme.inputBackgroundColor,
//                             '&::placeholder': { color: theme.textColor },
//                             padding: '5px',
//                             marginBottom: '5px'
//                         }}
//                     />
//                     <InputBase placeholder='Subject' name="subject" onChange={onValueChange} value={data.subject || ''} fullWidth 
//                         sx={{ 
//                             color: theme.textColor, 
//                             bgcolor: theme.inputBackgroundColor,
//                             '&::placeholder': { color: theme.textColor },
//                             padding: '5px',
//                             marginBottom: '5px'
//                         }}
//                     />
//                 </Box>

//                 <Box flex="1" padding="15px" overflow="auto" sx={{backgroundColor: theme.backgroundColor}}>
//                     {memoizedToolbar}
//                     <Paper variant="outlined" style={{ padding: '10px', minHeight: '300px', backgroundColor: theme.inputBackgroundColor, color: theme.textColor}}>
//                         <Editor
//                             editorState={editorState}
//                             onChange={handleEditorChange}
//                             plugins={plugins}
//                         />
//                     </Paper>
//                 </Box>

//                 {attachments.length > 0 && (
//                     <Box padding="10px">
//                         {attachments.map((file, index) => (
//                             <Box key={index} display="flex" alignItems="center" justifyContent="space-between" bgcolor={theme.inputBackgroundColor} padding="5px" borderRadius="5px" marginBottom="5px">
//                                 <Typography variant="body2" sx={{ color: theme.textColor }}>{file}</Typography>
//                                 <IconButton onClick={() => removeAttachment(file)} size="small" sx={{ color: theme.textColor }}> 
//                                     <DeleteOutline fontSize="small" />
//                                 </IconButton>
//                             </Box>
//                         ))}
//                     </Box>
//                 )}

//                 <Box display="flex" justifyContent="space-between" padding="10px 15px" alignItems="center" sx={{backgroundColor: theme.backgroundColor}}>
//                     <Box display="flex" alignItems="center">
//                         <Button variant="contained" color="primary" onClick={()=> {sendEmail(); setOpenDrawer(false); clearAllFields();}}>Send</Button>
//                         <Tooltip title="Attach file">
//                             <IconButton component="label" sx={{color: theme.textColor}}>
//                                 <AttachFile />
//                                 <input type="file" hidden multiple onChange={handleFileUpload} />
//                             </IconButton>
//                         </Tooltip>
//                     </Box>
//                     <Box display="flex" alignItems="center">
//                         <Button onClick={saveAsDraft} sx={{ marginRight: '10px' }}>Save Draft</Button>
//                         <Tooltip title="Clear all fields">
//                             <IconButton onClick={clearAllFields} sx={{color: theme.textColor}}>
//                                 <DeleteOutline />
//                             </IconButton>
//                         </Tooltip>
//                     </Box>
//                 </Box>
//             </Box>
//         </Dialog>
//     );
// };

// export default ComposeMail;

// import React, { useState, useEffect, useCallback } from 'react';
// import {
//     Dialog, Box, InputBase, Button, MenuItem,
//     IconButton, Typography, Paper, Tooltip, FormControlLabel, Checkbox
// } from '@mui/material';
// import { Close, DeleteOutline, AttachFile } from '@mui/icons-material';
// import axios from 'axios';
// import { useNavigate, useLocation } from 'react-router-dom';

// const dialogStyle = {
//     height: '90%',
//     width: '80%',
//     maxWidth: '100%',
//     maxHeight: '100%',
//     boxShadow: 'none',
//     borderRadius: '10px 10px 0 0',
// };

// const ComposeMail = ({ open, setOpenDrawer, isDarkTheme }) => {
//     const [loggedInUserEmail, setLoggedInUserEmail] = useState('');
//     const [data, setData] = useState({});
//     const [selectedGroups, setSelectedGroups] = useState([]);
//     const [attachments, setAttachments] = useState([]);
//     const [showDropdown, setShowDropdown] = useState(false);
//     const navigate = useNavigate();
//     const location = useLocation();
//     const draftData = location.state?.draft; // Retrieve draft data from state
//     const [userGroups, setUserGroups] = useState([]);

//     useEffect(() => {
//         const user = JSON.parse(localStorage.getItem('user'));
//         if (user?.email) {
//             setLoggedInUserEmail(user.email);
//             setData(prevData => ({ ...prevData, from: user.email }));
//         }
//     }, []);

//     useEffect(() => {
//         if (draftData) {
//             console.log("Draft data received:", draftData);
//             setData({
//                 _id:draftData._id || '',
//                 to: draftData.to || '',
//                 cc: draftData.cc || '',
//                 bcc: draftData.bcc || '',
//                 subject: draftData.subject || '',
//                 from: draftData.from || '',
//                 body: draftData.body || '',
//             });
//             setAttachments(draftData.attachments || []);
//         }
//     }, [draftData]);

//     // Fetch groups from the database based on logged-in user's email
//     useEffect(() => {
//         const fetchGroups = async () => {
//             try {
//                 const response = await axios.post('http://localhost:1973/api/groups/fetch-groups', {
//                     emailId: loggedInUserEmail, // Send emailId to fetch groups
//                 });
//                 setUserGroups(response.data);
//             } catch (error) {
//                 console.error('Error fetching groups:', error);
//             }
//         };

//         if (loggedInUserEmail) {
//             fetchGroups();
//         }
//     }, [loggedInUserEmail]);

//     const theme = {
//         backgroundColor: isDarkTheme ? '#1a1a1a' : '#ffffff',
//         textColor: isDarkTheme ? '#ffffff' : '#000000',
//         inputBackgroundColor: isDarkTheme ? '#333333' : '#f2f6fc',
//         borderColor: isDarkTheme ? '#444444' : '#cccccc',
//         hoverColor: isDarkTheme ? '#2c2c2c' : '#e6e6e6',
//     };

//     const onValueChange = useCallback((e) => {
//         if (e.target.name === 'to') {
//             const inputEmails = e.target.value.split(',').map(email => email.trim());
//             const selectedEmails = userGroups
//                 .filter(group => selectedGroups.includes(group.groupName))
//                 .flatMap(group => group.members);

//             const allEmails = Array.from(new Set([...inputEmails, ...selectedEmails]));
//             setData(prevData => ({ ...prevData, [e.target.name]: allEmails.join(', ') }));
//         } else {
//             setData(prevData => ({ ...prevData, [e.target.name]: e.target.value }));
//         }
//     }, [selectedGroups, userGroups]);

//     const handleGroupSelection = useCallback((groupName) => {
//         setSelectedGroups(prevGroups => {
//             const updatedGroups = prevGroups.includes(groupName)
//                 ? prevGroups.filter(group => group !== groupName)
//                 : [...prevGroups, groupName];

//             const typedEmails = data.to ? data.to.split(',').map(email => email.trim()) : [];
//             const selectedEmails = userGroups
//                 .filter(group => updatedGroups.includes(group.groupName))
//                 .flatMap(group => group.members)
//                 .filter(email => email !== loggedInUserEmail); // Exclude logged-in user's email

//             const removedEmails = prevGroups.includes(groupName)
//                 ? userGroups.find(group => group.groupName === groupName)?.members || []
//                 : [];

//             const allEmails = Array.from(new Set([
//                 ...typedEmails.filter(email => !removedEmails.includes(email)),
//                 ...selectedEmails
//             ]));

//             setData(prevData => ({ ...prevData, to: allEmails.join(', ') }));

//             return updatedGroups;
//         });
//     }, [data.to, userGroups, loggedInUserEmail]);

//     const handleFileUpload = useCallback((event) => {
//         const files = event.target.files;
//         if (files.length > 0) {
//             const newAttachments = Array.from(files).map(file => file.name);
//             setAttachments(prevAttachments => [...prevAttachments, ...newAttachments]);
//         }
//     }, []);

//     const removeAttachment = useCallback((fileName) => {
//         setAttachments(prevAttachments => prevAttachments.filter(file => file !== fileName));
//     }, []);

//     const sendEmail = async () => {
//         // Validate that recipients and subject are present
//         if (!data.to || data.to.length === 0) {
//             alert("Recipient field should not be empty.");
//         }

//         try {
//             const emailData = {
//                 to: data.to,
//                 from: loggedInUserEmail,
//                 cc: data.cc,
//                 bcc: data.bcc,
//                 subject: data.subject,
//                 body: data.body,
//                 date: new Date(),
//                 attachments: attachments,
//             };
    
//             console.log("Attempting to send email with data:", emailData);
//             const response = await axios.post(`http://localhost:1973/api/send`, emailData);
            
    
//             // If this was a draft, delete it from the database
//             if (draftData?._id) {
//                 await axios.delete(`http://localhost:1973/api/drafts/${draftData._id}`);
//                 console.log('Draft deleted successfully');
//             }
    
//             navigate('/app/inbox'); 
//             console.log('Response from server:', response.data);
//         } catch (error) {
//             console.error('Error sending email:', error);
//         }
//     };
    

//     const saveAsDraft = useCallback(async () => {
        
//         try {
//             const draftData = {
//                 _id: data._id , 
//                 to: data.to,
//                 from: loggedInUserEmail,
//                 cc: data.cc,
//                 bcc: data.bcc,
//                 subject: data.subject,
//                 body: data.body,
//                 attachments: attachments,
//             };
    
//             console.log('Attempting to save draft with data:', draftData);
            
            
//             const response = await axios.post('http://localhost:1973/api/drafts', draftData);
            
//             console.log('Response from server:', response.data);
//             navigate('/app/inbox'); 
//         } catch (error) {
//             console.error('Error saving draft:', error);
//         }
//     }, [data, attachments, loggedInUserEmail]);


//     const clearAllFields = useCallback(() => {
//         setData({
//             to: '',
//             cc: '',
//             bcc: '',
//             subject: '',
//             body: '',
//             from: loggedInUserEmail
//         });
//         setAttachments([]);
//         setShowDropdown(false);
//         setSelectedGroups([]);
//     }, [loggedInUserEmail]);

//     const handleClose = () => {
//         clearAllFields();
//         setOpenDrawer(false);
//         //navigate('/app/inbox');
//     };

//     return (
//         <Dialog
//             open={open}
//             onClose={handleClose}
//             PaperProps={{
//                 sx: {
//                     ...dialogStyle,
//                     backgroundColor: theme.backgroundColor,
//                     color: theme.textColor
//                 }
//             }}
//         >
//             <Box display="flex" flexDirection="column" height="100%" sx={{ backgroundColor: theme.backgroundColor }}>
//                 <Box display="flex" justifyContent="space-between" padding="5px 10px" position="relative" bgcolor={theme.backgroundColor}>
//                     <Typography variant="subtitle1" style={{ fontSize: '1rem', color: theme.textColor }}>New Message</Typography>
//                     <IconButton onClick={handleClose} sx={{ color: theme.textColor }}>
//                         <Close fontSize="small" />
//                     </IconButton>
//                 </Box>

//                 <Box padding="0 15px">
//                     <InputBase
//                         placeholder='Recipients'
//                         name="to"
//                         onChange={onValueChange}
//                         value={data.to || ''}
//                         fullWidth
//                         sx={{
//                             color: theme.textColor,
//                             bgcolor: theme.inputBackgroundColor,
//                             '&::placeholder': { color: theme.textColor },
//                             padding: '5px',
//                             marginBottom: '5px'
//                         }}
//                         onClick={() => setShowDropdown(prev => !prev)}
//                     />
//                     {showDropdown && (
//                         <Box sx={{
//                             position: 'absolute',
//                             zIndex: 1,
//                             backgroundColor: theme.backgroundColor,
//                             border: '1px solid ${theme.borderColor}',
//                             borderRadius: '4px',
//                             marginTop: '2px',
//                             maxHeight: '170px',
//                             overflowY: 'auto',
//                             width: '100%'
//                         }}>
//                             <Typography variant="subtitle2" sx={{ padding: '5px', fontWeight: 'bold', fontSize: '13px', color: theme.textColor }}>
//                             Select Groups
//                             </Typography>
//                             {userGroups.map((group, index) => (
//                                 <MenuItem key={index} sx={{
//                                     '&:hover': { backgroundColor: theme.hoverColor },
//                                 }}>
//                                     <FormControlLabel
//                                         control={
//                                             <Checkbox
//                                                 checked={selectedGroups.includes(group.groupName)}
//                                                 onChange={() => handleGroupSelection(group.groupName)}
//                                                 sx={{color: theme.textColor}}
//                                             />
//                                         }
//                                         label={<Typography sx={{ fontSize: '13px', color: theme.textColor }}>{group.groupName}</Typography>}
//                                     />
//                                 </MenuItem>
//                             ))}
//                         </Box>
//                     )}
//                 </Box>

//                 <Box padding="0 15px">
//                     <InputBase
//                         placeholder="CC"
//                         name="cc"
//                         onChange={onValueChange}
//                         value={data.cc || ''}
//                         fullWidth
//                         sx={{
//                             color: theme.textColor,
//                             bgcolor: theme.inputBackgroundColor,
//                             '&::placeholder': { color: theme.textColor },
//                             padding: '5px',
//                             marginBottom: '5px'
//                         }}
//                     />
//                     <InputBase
//                         placeholder="BCC"
//                         name="bcc"
//                         onChange={onValueChange}
//                         value={data.bcc || ''}
//                         fullWidth
//                         sx={{
//                             color: theme.textColor,
//                             bgcolor: theme.inputBackgroundColor,
//                             '&::placeholder': { color: theme.textColor },
//                             padding: '5px',
//                             marginBottom: '5px'
//                         }}
//                     />
//                     <InputBase
//                         placeholder="Subject"
//                         name="subject"
//                         onChange={onValueChange}
//                         value={data.subject || ''}
//                         fullWidth
//                         sx={{
//                             color: theme.textColor,
//                             bgcolor: theme.inputBackgroundColor,
//                             '&::placeholder': { color: theme.textColor },
//                             padding: '5px',
//                             marginBottom: '5px'
//                         }}
//                     />
//                 </Box>

//                 <Box padding="0 15px">
//                     <InputBase
//                         placeholder="Body"
//                         name="body"
//                         onChange={onValueChange}
//                         value={data.body || ''}
//                         fullWidth
//                         multiline
//                         rows={10}
//                         sx={{
//                             color: theme.textColor,
//                             bgcolor: theme.inputBackgroundColor,
//                             '&::placeholder': { color: theme.textColor },
//                             padding: '5px',
//                             marginBottom: '5px'
//                         }}
//                     />
//                 </Box>

//                 {attachments.length > 0 && (
//                     <Paper sx={{
//                         display: 'flex', padding: '10px', margin: '15px',
//                         backgroundColor: theme.inputBackgroundColor, border: `1px solid ${theme.borderColor}`
//                     }}>
//                         <Typography variant="subtitle1" sx={{ color: theme.textColor }}>
//                             Attachments:
//                         </Typography>
//                         <Box>
//                             {attachments.map((attachment, index) => (
//                                 <Tooltip title="Remove attachment" key={index}>
//                                     <Box sx={{
//                                         display: 'flex',
//                                         marginLeft: '10px',
//                                         color: theme.textColor
//                                     }}>
//                                         {attachment}
//                                         <IconButton onClick={() => removeAttachment(attachment)}>
//                                             <DeleteOutline fontSize="small" sx={{ color: theme.textColor }} />
//                                         </IconButton>
//                                     </Box>
//                                 </Tooltip>
//                             ))}
//                         </Box>
//                     </Paper>
//                 )}

//                 <Box display="flex" justifyContent="space-between" padding="10px 15px">
//                     <Box display="flex" alignItems="center">
//                         <Tooltip title="Attach file">
//                             <IconButton component="label">
//                                 <AttachFile fontSize="small" sx={{ color: theme.textColor }} />
//                                 <input hidden type="file" onChange={handleFileUpload} multiple />
//                             </IconButton>
//                         </Tooltip>
//                     </Box>
//                     <Box>
//                         <Button variant="outlined" onClick={()=> {saveAsDraft();}} sx={{ marginRight: '5px', color: theme.textColor }}>Save Draft</Button>
//                         <Button variant="contained" onClick={()=> {sendEmail(); setOpenDrawer(false); clearAllFields();}} sx={{ backgroundColor: '#1a73e8', color: '#ffffff' }}>Send</Button>
//                     </Box>
//                 </Box>
//             </Box>
//         </Dialog>
//     );
// };

// export default ComposeMail;

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Typography,
    InputBase,
    Button,
    IconButton,
    Dialog,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Paper,
    Tooltip
} from '@mui/material';
import {
    Close,
    DeleteOutline,
    AttachFile
} from '@mui/icons-material';

const ComposeMail = ({ open, setOpenDrawer, isDarkTheme, draftData }) => {
    const [loggedInUserEmail, setLoggedInUserEmail] = useState('');
    const [data, setData] = useState({});
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const [userGroups, setUserGroups] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.email) {
            setLoggedInUserEmail(user.email);
            setData(prevData => ({ ...prevData, from: user.email }));
        }
    }, []);

    useEffect(() => {
        if (draftData) {
            console.log("Draft data received:", draftData);
            setData({
                _id: draftData._id || '',
                to: draftData.to || '',
                cc: draftData.cc || '',
                bcc: draftData.bcc || '',
                subject: draftData.subject || '',
                from: draftData.from || '',
                body: draftData.body || '',
            });
            setAttachments(draftData.attachments || []);
        }
    }, [draftData]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.post('http://localhost:1973/api/groups/fetch-groups', {
                    emailId: loggedInUserEmail,
                });
                setUserGroups(response.data);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };

        if (loggedInUserEmail) {
            fetchGroups();
        }
    }, [loggedInUserEmail]);

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
            const selectedEmails = userGroups
                .filter(group => selectedGroups.includes(group.groupName))
                .flatMap(group => group.members);

            const allEmails = Array.from(new Set([...inputEmails, ...selectedEmails]));
            setData(prevData => ({ ...prevData, [e.target.name]: allEmails.join(', ') }));
        } else {
            setData(prevData => ({ ...prevData, [e.target.name]: e.target.value }));
        }
    }, [selectedGroups, userGroups]);

    const handleGroupSelection = useCallback((groupName) => {
        setSelectedGroups(prevGroups => {
            const updatedGroups = prevGroups.includes(groupName)
                ? prevGroups.filter(group => group !== groupName)
                : [...prevGroups, groupName];

            const typedEmails = data.to ? data.to.split(',').map(email => email.trim()) : [];
            const selectedEmails = userGroups
                .filter(group => updatedGroups.includes(group.groupName))
                .flatMap(group => group.members)
                .filter(email => email !== loggedInUserEmail);

            const removedEmails = prevGroups.includes(groupName)
                ? userGroups.find(group => group.groupName === groupName)?.members || []
                : [];

            const allEmails = Array.from(new Set([
                ...typedEmails.filter(email => !removedEmails.includes(email)),
                ...selectedEmails
            ]));

            setData(prevData => ({ ...prevData, to: allEmails.join(', ') }));

            return updatedGroups;
        });
    }, [data.to, userGroups, loggedInUserEmail]);

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
        if (!data.to || data.to.length === 0) {
            alert("Recipient field should not be empty.");
            return;
        }

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
            
            if (draftData?._id) {
                await axios.delete(`http://localhost:1973/api/drafts/${draftData._id}`);
                console.log('Draft deleted successfully');
            }
    
            //navigate('/app/inbox'); 
            console.log('Response from server:', response.data);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    const saveAsDraft = useCallback(async () => {
        try {
            const draftData = {
                _id: data._id, 
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
            //navigate('/app/inbox'); 
        } catch (error) {
            console.error('Error saving draft:', error);
        }
    }, [data, attachments, loggedInUserEmail, navigate]);

    const clearAllFields = useCallback(() => {
        setData({
            to: '',
            cc: '',
            bcc: '',
            subject: '',
            body: '',
            from: loggedInUserEmail
        });
        setAttachments([]);
        setShowDropdown(false);
        setSelectedGroups([]);
    }, [loggedInUserEmail]);

    const handleClose = () => {
        clearAllFields();
        setOpenDrawer(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    width: '80%',
                    height: '90%',
                    maxWidth: 'none',
                    maxHeight: 'none',
                    backgroundColor: theme.backgroundColor,
                    color: theme.textColor
                }
            }}
        >
            <Box display="flex" flexDirection="column" height="100%" sx={{ backgroundColor: theme.backgroundColor }}>
                <Box display="flex" justifyContent="space-between" padding="5px 10px" position="relative" bgcolor={theme.backgroundColor}>
                    <Typography variant="subtitle1" style={{ fontSize: '1rem', color: theme.textColor }}>New Message</Typography>
                    <IconButton onClick={handleClose} sx={{ color: theme.textColor }}>
                        <Close fontSize="small" />
                    </IconButton>
                </Box>

                <Box padding="0 15px">
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
                            width: 'calc(100% - 30px)'
                        }}>
                            <Typography variant="subtitle2" sx={{ padding: '5px', fontWeight: 'bold', fontSize: '13px', color: theme.textColor }}>
                            Select Groups
                            </Typography>
                            {userGroups.map((group, index) => (
                                <MenuItem key={index} sx={{
                                    '&:hover': { backgroundColor: theme.hoverColor },
                                }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selectedGroups.includes(group.groupName)}
                                                onChange={() => handleGroupSelection(group.groupName)}
                                                sx={{color: theme.textColor}}
                                            />
                                        }
                                        label={<Typography sx={{ fontSize: '13px', color: theme.textColor }}>{group.groupName}</Typography>}
                                    />
                                </MenuItem>
                            ))}
                        </Box>
                    )}
                </Box>

                <Box padding="0 15px">
                    <InputBase
                        placeholder="CC"
                        name="cc"
                        onChange={onValueChange}
                        value={data.cc || ''}
                        fullWidth
                        sx={{
                            color: theme.textColor,
                            bgcolor: theme.inputBackgroundColor,
                            '&::placeholder': { color: theme.textColor },
                            padding: '5px',
                            marginBottom: '5px'
                        }}
                    />
                    <InputBase
                        placeholder="BCC"
                        name="bcc"
                        onChange={onValueChange}
                        value={data.bcc || ''}
                        fullWidth
                        sx={{
                            color: theme.textColor,
                            bgcolor: theme.inputBackgroundColor,
                            '&::placeholder': { color: theme.textColor },
                            padding: '5px',
                            marginBottom: '5px'
                        }}
                    />
                    <InputBase
                        placeholder="Subject"
                        name="subject"
                        onChange={onValueChange}
                        value={data.subject || ''}
                        fullWidth
                        sx={{
                            color: theme.textColor,
                            bgcolor: theme.inputBackgroundColor,
                            '&::placeholder': { color: theme.textColor },
                            padding: '5px',
                            marginBottom: '5px'
                        }}
                    />
                </Box>

                <Box padding="0 15px" flexGrow={1}>
                    <InputBase
                        placeholder="Content"
                        name="body"
                        onChange={onValueChange}
                        value={data.body || ''}
                        fullWidth
                        multiline
                        sx={{
                            color: theme.textColor,
                            bgcolor: theme.inputBackgroundColor,
                            '&::placeholder': { color: theme.textColor },
                            padding: '5px',
                            marginBottom: '5px',
                            height: '100%',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start'
                        }}
                    />
                </Box>

                {attachments.length > 0 && (
                    <Paper sx={{
                        display: 'flex', padding: '10px', margin: '15px',
                        backgroundColor: theme.inputBackgroundColor, border: `1px solid ${theme.borderColor}`
                    }}>
                        <Typography variant="subtitle1" sx={{ color: theme.textColor }}>
                            Attachments:
                        </Typography>
                        <Box>
                            {attachments.map((attachment, index) => (
                                <Tooltip title="Remove attachment" key={index}>
                                    <Box sx={{
                                        display: 'flex',
                                        marginLeft: '10px',
                                        color: theme.textColor
                                    }}>
                                        {attachment}
                                        <IconButton onClick={() => removeAttachment(attachment)}>
                                            <DeleteOutline fontSize="small" sx={{ color: theme.textColor }} />
                                        </IconButton>
                                    </Box>
                                </Tooltip>
                            ))}
                        </Box>
                    </Paper>
                )}

                <Box display="flex" justifyContent="space-between" padding="10px 15px">
                    <Box display="flex" alignItems="center">
                        <Tooltip title="Attach file">
                            <IconButton component="label">
                                <AttachFile fontSize="small" sx={{ color: theme.textColor }} />
                                <input hidden type="file" onChange={handleFileUpload} multiple />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box>
                        <Button variant="outlined" onClick={()=>{saveAsDraft(); setOpenDrawer(false)}} sx={{ marginRight: '5px', color: theme.textColor }}>Save Draft</Button>
                        <Button variant="contained" onClick={() => { sendEmail(); setOpenDrawer(false); clearAllFields(); }} sx={{ backgroundColor: '#1a73e8', color: '#ffffff' }}>Send</Button>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
};

export default ComposeMail;