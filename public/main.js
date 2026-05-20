import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getDatabase, ref, get, set, update, remove, onValue, child } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCuFTHXCgfgSNU-W4ayQLYE1nU95dq9RVM",
  authDomain: "realtime25-c5f73.firebaseapp.com",
  databaseURL: "https://realtime25-c5f73-default-rtdb.firebaseio.com",
  projectId: "realtime25-c5f73",
  storageBucket: "realtime25-c5f73.firebasestorage.app",
  messagingSenderId: "295989736020",
  appId: "1:295989736020:web:52a432d2614a753db5b3c1"
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* -------- References ---------- */
let varId=document.getElementById("formId");
let varTitulo=document.getElementById("formTitulo");
let varArtista=document.getElementById("formArtista");
// Referência para o novo container que só guarda os cards
const musicaListContainer = document.getElementById("musicaListContainer"); 

/* --------- Buttons  ---------*/
let gravar=document.getElementById("btGravar");
let buscar=document.getElementById("btBuscar");
let atualizar=document.getElementById("btEdit");
let excluir=document.getElementById("btExcluir");
let limpar=document.getElementById("limpar");
//   let mostrar=document.getElementById("btMostrar"); --- IGNORE ---

// ----------------------------------------------------------------------
// Implementação do Listener em Tempo Real (onValue)
// ----------------------------------------------------------------------
const musicasRef = ref(db, 'Musicas');

onValue(musicasRef, (snapshot) => {
    // 1. Limpa apenas o container da lista (não o header)
    musicaListContainer.innerHTML = ''; 

    if (snapshot.exists()) {
        
        // 2. Itera sobre o snapshot de dados
        snapshot.forEach((data) => {
            const musicItem = {
                id: data.key, 
                title: data.val().titulo,
                artist: data.val().artista,
            };

            // 3. Cria e anexa o card de música
            const musicCard = document.createElement("div");
            musicCard.classList.add("card", "music-card", "p-2", "mt-2"); 
            musicCard.innerHTML = `<strong>${musicItem.id}:</strong> ${musicItem.title} - ${musicItem.artist}`;
            
            musicaListContainer.appendChild(musicCard);
        });
    } else {
        const noData = document.createElement("div");
        noData.classList.add("alert", "alert-info", "mt-3");
        noData.innerHTML = "Nenhuma música cadastrada.";
        musicaListContainer.appendChild(noData);
    }
}, (error) => {
    console.error("Erro ao configurar o listener do Realtime Database:", error);
});

/*----- functions  -----*/
//clean form
limpar.addEventListener('click',function(){
     varId.value="";
     varTitulo.value="";
     varArtista.value="";
});


//save music data to the database
gravar.addEventListener('click',function(){  
     set(ref(db, "Musicas/"+varId.value),{
          titulo:varTitulo.value,
          artista: varArtista.value     

     }).then(()=>{
          console.log("incluído com sucesso");
          // O onValue faz o refresh automático
     })
     .catch((error)=>{
          console.error("Erro ao incluir dado no Realtime Database:", error);
     })
});

//search music data from the database
buscar.addEventListener('click',function(){
    if (varId.value === "") {
        alert("Por favor, preencha o campo Identificador.");
        return; 
    }
     const dbref = ref(db);
     get(child(dbref, "Musicas/"+varId.value)).then((snapshot)=>{
          if(snapshot.exists()){
               varTitulo.value = snapshot.val().titulo;
               varArtista.value= snapshot.val().artista;
          }
          else alert("nao existe dado");

     }).catch((error)=>{
          console.error("Erro ao buscar dado no Realtime Database:", error);
     })
});

//update music data from the database
atualizar.addEventListener('click',function(){
    if (varId.value === "") {
        alert("Por favor, preencha o campo Identificador.");
        return; 
    }
    update(ref(db, "Musicas/"+varId.value),{
          titulo:varTitulo.value,
          artista: varArtista.value

     }).then(()=>{
          console.log("atualizado com sucesso");
          // O onValue faz o refresh automático
     })
     .catch((error)=>{
          console.error("Erro ao atualizar dado no Realtime Database:", error);
     })
});

//delete music data from the database
excluir.addEventListener('click',function(){
    if (varId.value === "") {
        alert("Por favor, preencha o campo Identificador.");
        return; 
    }
    // 💡 CORREÇÃO: A função remove() recebe apenas a referência (ref)
     remove(ref(db, "Musicas/"+varId.value))
      .then(()=>{
           alert("excluído com sucesso");
           // O onValue faz o refresh automático
      })
      .catch((error)=>{
           console.error("Erro ao excluir dado no Realtime Database:", error);
      })
 });