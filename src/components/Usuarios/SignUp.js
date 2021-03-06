import { useState, useEffect } from 'react';
import styles from '../../css/SignUp.module.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';


export function SignUp({ title = "Registrate", subTitle = "Comenta tus libros favoritos" }) {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [tipo, setTipo] = useState('');

    const useStyles = makeStyles(theme => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem 1.2rem',
            background: 'white',
            borderRadius: '20px',

            '& .MuiTextField-root': {
                margin: '5px',
                width: '300px',
            },
            '& .MuiButtonBase-root': {
                margin: '5px',
            },
        },
    }));


    async function signUp() {
        let item = { nombre, apellido, email, password, username, tipo }
        console.warn(item);
        let result = await fetch('https://libreriapi.herokuapp.com/v1/usuarios', {
            method: 'POST',
            body: JSON.stringify(item),
            headers: new Headers({
                "Content-Type": "application/json; charset=utf-8",
                "Access-Control-Allow-Origin": "*",
            })
        })
        result = await result.json()
        localStorage.setItem(
            "user-info", JSON.stringify(result)
        );
    }

    const classes = useStyles();
    return (
        <section className={styles.container}>
            <form className={classes.root} onSubmit={signUp}>
            <p className={styles.title}>{title}</p>
            <p className={styles.subTitle}>{subTitle}</p>
                <TextField
                    label="Usuario"
                    variant="filled"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <TextField
                    label="Nombre"
                    variant="filled"
                    required
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                />
                <TextField
                    label="Apellido"
                    variant="filled"
                    required
                    value={apellido}
                    onChange={e => setApellido(e.target.value)}
                />
                <TextField
                    label="Email"
                    variant="filled"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    variant="filled"
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <TextField
                    label="Tipo (admin)"
                    variant="filled"
                    type="text"
                    required
                    value={tipo}
                    onChange={e => setTipo(e.target.value)}
                    
                />

                <div>
                    <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained" color="success" endIcon={<SendIcon />}>
                        Registrarse
                    </Button>
                </div>
            </form>
        </section>
    );

}
