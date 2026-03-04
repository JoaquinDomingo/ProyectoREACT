import React, { useState, useRef, useEffect } from 'react';
import { Fab, Paper, Box, Typography, TextField, IconButton, CircularProgress } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import api from '../context/api';
import { useAuth } from '../context/AuthContext';

const FloatingAssistant = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: '¡Hola! Soy GameManager AI. ¿En qué te puedo ayudar hoy?' }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (!user) return null; // Solo mostramos asistente a usuarios registrados

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await api.post('/games/chat', { message: input });
            setMessages(prev => [...prev, { role: 'assistant', text: res.data.response }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'assistant', text: 'Lo siento, tuve un problema al conectarme.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isOpen && (
                <Paper
                    elevation={6}
                    sx={{
                        position: 'fixed',
                        bottom: 90,
                        right: 30,
                        width: 350,
                        height: 500,
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 1000,
                        borderRadius: 3,
                        overflow: 'hidden',
                        bgcolor: 'background.paper'
                    }}
                >
                    <Box sx={{ background: 'linear-gradient(45deg, #6366f1 30%, #ec4899 90%)', color: 'white', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SmartToyIcon />
                            <Typography variant="h6" fontWeight="bold">Asistente IA</Typography>
                        </Box>
                        <IconButton size="small" onClick={toggleChat} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, bgcolor: 'background.default' }}>
                        {messages.map((msg, idx) => (
                            <Box key={idx} sx={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 1.5,
                                        bgcolor: msg.role === 'user' ? 'primary.main' : 'background.paper',
                                        color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                                        borderRadius: 2,
                                        borderBottomRightRadius: msg.role === 'user' ? 0 : 8,
                                        borderBottomLeftRadius: msg.role === 'assistant' ? 0 : 8,
                                    }}
                                >
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{msg.text}</Typography>
                                </Paper>
                            </Box>
                        ))}
                        {isLoading && (
                            <Box sx={{ alignSelf: 'flex-start' }}>
                                <Paper elevation={1} sx={{ p: 1.5, borderRadius: 2, borderBottomLeftRadius: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CircularProgress size={16} />
                                    <Typography variant="body2" color="text.secondary">Pensando...</Typography>
                                </Paper>
                            </Box>
                        )}
                        <div ref={messagesEndRef} />
                    </Box>

                    <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 1 }}>
                        <TextField
                            fullWidth
                            size="small"
                            variant="outlined"
                            placeholder="Escribe aquí..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <IconButton color="primary" onClick={handleSend} disabled={isLoading || !input.trim()}>
                            <SendIcon />
                        </IconButton>
                    </Box>
                </Paper>
            )}

            <Fab
                color="primary"
                aria-label="chat"
                onClick={toggleChat}
                sx={{
                    position: 'fixed',
                    bottom: 30,
                    right: 30,
                    zIndex: 1000,
                    background: 'linear-gradient(45deg, #6366f1 30%, #ec4899 90%)',
                    '&:hover': {
                        transform: 'scale(1.05)',
                        transition: 'transform 0.2s'
                    }
                }}
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </Fab>
        </>
    );
};

export default FloatingAssistant;
