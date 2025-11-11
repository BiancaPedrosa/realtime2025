
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getDatabase, ref, get, set, child, push, update, remove } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDoUBuN4FfpvPbB5KvmS6Z4jfh3D3E1b3s",
  authDomain: "realtime252-16cd7.firebaseapp.com",
  databaseURL: "https://realtime252-16cd7-default-rtdb.firebaseio.com",
  projectId: "realtime252-16cd7",
  storageBucket: "realtime252-16cd7.firebasestorage.app",
  messagingSenderId: "813830241791",
  appId: "1:813830241791:web:9c22713f8c217a40a87bca"
};

const app = initializeApp(firebaseConfig);
const db=getDatabase();

/* -------- References ---------- */
let varId=document.getElementById("formId");
let varTitulo=document.getElementById("formTitulo");
let varArtista=document.getElementById("formArtista");

/* --------- Buttons  ---------*/
let gravar=document.getElementById("btGravar");
let buscar=document.getElementById("btBuscar");
let atualizar=document.getElementById("btEdit");
let excluir=document.getElementById("btExcluir");
let limpar=document.getElementById("limpar");
let mostrar=document.getElementById("btMostrar");    

/*----- functions  -----*/
//clean form
limpar.addEventListener('click',function(){
     varId.value="";
     varTitulo.value="";
     varArtista.value="";
});

//Get all music data from the database
document.addEventListener("DOMContentLoaded", async function() {
    // Get a reference to the database
    const databaseRef = ref(getDatabase());

    try {
        // Fetch music data from the 'Musicas' node
        const snapshot = await get(child(databaseRef, 'Musicas'));

        if (snapshot.exists()) {
            const musicData = [];
            // Iterate through the snapshot and extract music details
            snapshot.forEach((data) => {
                const musicItem = {
                    id: data.key, // Use 'id' for better clarity
                    title: data.val().titulo,
                    artist: data.val().artista,
                };
                musicData.push(musicItem);
            });

            // Get the container element for displaying music cards
            const musicCardsContainer = document.getElementById("musicaCards");

            // Create and append a card for each music item
            musicData.forEach((music) => {
                const musicCard = document.createElement("div");
                musicCard.classList.add("card"); // Add a CSS class for styling
                musicCard.innerHTML = `${music.id}: ${music.title} -> ${music.artist}`; // Use template literals for cleaner string formatting
                musicCardsContainer.appendChild(musicCard); // Use appendChild for better performance
            });
        } else {
            console.log("No data available");
        }
    } catch (error) {
        console.error(error);
    }
});

//show all music data from the database
mostrar.addEventListener("click",function(){
     location.reload();
});
//save music data to the database
gravar.addEventListener('click',function(){
     //para gerar chaves automáticas use: const novaChave = push(child(ref(db), 'Musicas')).key;

     set(ref(db, "Musicas/"+varId.value),{
          titulo:varTitulo.value,
          artista: varArtista.value

     }).then(()=>{
          console.log("incluído com sucesso");
     })
     .catch((error)=>{
          console.log("erro de inclusão");
     })
});
//search music data from the database
buscar.addEventListener('click',function(){
    // Check if the ID field is empty
    if (varId.value === "") {
        alert("Por favor, preencha o campo Identificador.");
        condo
        return; // Stop the function if the ID is empty
    }
     // Check if the ID field is empty
    if (varId.value === "") {
     alert("Por favor, preencha o campo Identificador.");
     return; // Stop the function if the ID is empty
     }
     const dbref = ref(db);
     get(child(dbref, "Musicas/"+varId.value)).then((snapshot)=>{
          if(snapshot.exists()){
               varTitulo.value = snapshot.val().titulo;
               varArtista.value= snapshot.val().artista;
          }
          else alert("nao existe dado");

     }).catch((error)=>{
          console.log("erro ",error);
     })
});
//update music data from the database
atualizar.addEventListener('click',function(){
    // Check if the ID field is empty
    if (varId.value === "") {
        alert("Por favor, preencha o campo Identificador.");
        return; // Stop the function if the ID is empty
    }
    update(ref(db, "Musicas/"+varId.value),{
          titulo:varTitulo.value,
          artista: varArtista.value

     }).then(()=>{
          console.log("atualizado com sucesso");
     })
     .catch((error)=>{
          console.log("erro de atualizacao");
     })
});
//delete music data from the database
excluir.addEventListener('click',function(){
    // Check if the ID field is empty
    if (varId.value === "") {
        alert("Por favor, preencha o campo Identificador.");
        return; // Stop the function if the ID is empty
    }
     remove(ref(db, "Musicas/"+varId.value),{
           titulo:varTitulo.value,
           artista: varArtista.value
 
      }).then(()=>{
           alert("excluído com sucesso");
      })
      .catch((error)=>{
           console.log("erro de exclusão");
      })
 });
