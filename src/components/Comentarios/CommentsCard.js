//COMPONENTE QUE DIBUJA UN TARJETA DE COMENTARIOS
import { useEffect, useState } from "react";
import CommentIcon from '@mui/icons-material/Comment';
import AddCommentIcon from '@mui/icons-material/AddComment';
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { Button, Typography } from "@mui/material";
import { requestApi } from "../../utils/httpClient";
import Modal from "./Modal";
import { Alert, Box, Snackbar  } from '@mui/material';

//Si el usuario está lougeado y guardado en local storage
const loggedUserJson = window.localStorage.getItem('loggedBooksAppUser') ? window.localStorage.getItem('loggedBooksAppUser') : null;

export function CommentsCard({ libroId, libroTitle, linkCoverBookLarge }) {  
  
  //Se obtienen los comentarios del libro
  const [comments, setComments] = useState([]); 

  //Ventana Modal para agregar comentarios
  const [openModal, setOpenModal] = useState(false);
  //Cambiar color al botón "Agregar comentarios"
  const [colorIconModal, setcolorIconModal] = useState("disabled");

  //Para mensajes en pantalla
  const [snackbar, setSnackBar] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [alertSeverity, setalertSeverity] = useState("error");
  
  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackBar(false);
  };

  //Abre la ventana modal para agregar comentarios
  const handleClickOpenModal = () => {        
    
    //Si el usuario ya está logueado
    if(loggedUserJson){
      setcolorIconModal("primary");
      setOpenModal(true);      
    } else {      
      setalertSeverity("error");
      setErrorMsg("Inicie Sesión para poder agregar un comentario"); 
      setSnackBar(true);
    }
  };

  //Cierra la ventana modal
  const handleClickCloseModal = () => {
    setcolorIconModal("disabled");
    setOpenModal(false);
  };

  //Función que integra un color al Avatar
  function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }
  
    return color;
  }

  useEffect(() => {
    const path = `/comentarios/`; //path para traer todos los comentarios de la API
    requestApi(path, "GET").then((data) => {
      //Se recibe el JSON con los datos de la petición
      const comentarios = data.filter(
        (comment) => comment.libro_id === libroId
      );
      setComments(comentarios.sort( (a, b) => (new Date(b.fecha).getTime() || new Date(b.createdAt).getTime()) - (new Date(a.fecha).getTime() || new Date(a.createdAt).getTime()) ) ); //Se modifica el estado de "comments" con los datos del JSON
    });
  }, [libroId, setComments, openModal, errorMsg]);

  //Guarda el total de comentarios en el libro
  let totalComments = 0;
  totalComments = comments.length === 0 ? 'Comentarios (0)' : `Comentarios (${comments.length})`;

  return (
    <>
      <Box sx={{ width: "auto", height: "auto", textAlign: "center" }}>
        <Paper>
          <CommentIcon  color="primary"/>
          <Typography variant="subtitle2" color="primary">
            {totalComments}
          </Typography>
        </Paper>        
      </Box>
      <Box sx={{ width: "auto", height: "120px", overflowY: "scroll" }}>
        <List>
          {comments.map(({ _id, nombre, email, texto, fecha }) => (
            <ListItem button key={_id}>
              <ListItemAvatar>
                <Avatar 
                  sx={{ backgroundColor: stringToColor(nombre) }}
                  alt={nombre} 
                  src={nombre} 
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" style={{ color: "#ff6f00" }}>
                    {nombre}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="subtitle2"
                    style={{ color: "gray", fontStyle: "italic" }}
                  >
                    {texto}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ width: "auto" }}>
        <Paper sx={{ }}>
          <Button onClick={handleClickOpenModal} sx={{ display: "flex", flexDirection: "column", padding: "5px 0", width: "100%"}}>
            <AddCommentIcon  color={colorIconModal}/>
          </Button>
        </Paper>        
        <Modal 
          openModal={openModal}
          handleClickCloseModal={handleClickCloseModal}
          libroTitle={libroTitle} 
          linkCoverBookLarge={linkCoverBookLarge}
          libroId={libroId}
          setErrorMsg={setErrorMsg}
          setSnackBar={setSnackBar}
          setalertSeverity={setalertSeverity}
        / >
        <Box>
          <Snackbar open={snackbar} autoHideDuration={6000} onClose={closeSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}>
            <Alert onClose={closeSnackbar} severity={alertSeverity} sx={{ width: '100%' }}>
              {errorMsg}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </>
  );
}
