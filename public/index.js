import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// TODO: Replace with your actual Supabase Project URL and Anon Key
const supabaseUrl = 'https://hkdszkrgdwsteledrfxl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrZHN6a3JnZHdzdGVsZWRyZnhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwODk4NDgsImV4cCI6MjA5NTY2NTg0OH0.T6xeAPJ78O6q9EBGBGpE1UbBYaepsi3OHQrym9iE6qQ';


const supabase = createClient(supabaseUrl, supabaseKey);

/* -------- References ---------- */
let varId = document.getElementById("formId");
let varTitulo = document.getElementById("formTitulo");
let varArtista = document.getElementById("formArtista");
// Referência para o novo container que só guarda os cards
const musicaListContainer = document.getElementById("musicaListContainer"); 

/* --------- Buttons  ---------*/
let gravar = document.getElementById("btGravar");
let buscar = document.getElementById("btBuscar");
let atualizar = document.getElementById("btEdit");
let excluir = document.getElementById("btExcluir");
let limpar = document.getElementById("limpar");

// ----------------------------------------------------------------------
// Implementação de Leitura e Realtime (Equivalente ao onValue)
// ----------------------------------------------------------------------

// 1. Função para buscar os dados e desenhar a tela
async function loadMusicas() {
    // Busca todas as músicas da tabela
    const { data, error } = await supabase.from('Musicas').select('*');
    
    if (error) {
        console.error("Erro ao buscar dados:", error);
        return;
    }

    // Limpa apenas o container da lista (não o header)
    musicaListContainer.innerHTML = ''; 

    if (data && data.length > 0) {
        // Itera sobre o array de resultados retornado pelo banco de dados SQL
        data.forEach((musicItem) => {
            const musicCard = document.createElement("div");
            musicCard.classList.add("card", "music-card", "p-2", "mt-2"); 
            musicCard.innerHTML = `<strong>${musicItem.id}:</strong> ${musicItem.titulo} - ${musicItem.artista}`;
            
            musicaListContainer.appendChild(musicCard);
        });
    } else {
        const noData = document.createElement("div");
        noData.classList.add("alert", "alert-info", "mt-3");
        noData.innerHTML = "Nenhuma música cadastrada.";
        musicaListContainer.appendChild(noData);
    }
}

// Chama a função pela primeira vez quando a página carrega
loadMusicas();

// 2. Inscreve no canal de Realtime para ouvir mudanças na tabela
supabase
  .channel('musicas-realtime')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'Musicas' }, (payload) => {
      console.log('Mudança detectada no banco de dados!', payload);
      // Quando detectar qualquer mudança (INSERT, UPDATE, DELETE), recarrega a lista
      loadMusicas();
  })
  .subscribe();

/*----- functions  -----*/
// Limpar formulário
limpar.addEventListener('click', function(){
     varId.value = "";
     varTitulo.value = "";
     varArtista.value = "";
});

// CREATE - Salvar no banco (Equivalente ao 'set' do Firebase)
gravar.addEventListener('click', async function(){  
    if (varId.value === "") {
        alert("Por favor, preencha o campo Identificador.");
        return; 
    }

    // Usamos 'upsert' no lugar de 'insert' para imitar o comportamento do Firebase 'set'
    // (Ele cria se não existir, e sobrescreve se já existir)
    const { error } = await supabase
        .from('Musicas')
        .upsert({
            id: varId.value,
            titulo: varTitulo.value,
            artista: varArtista.value     
        });

    if (error) {
        console.error("Erro ao incluir dado no Supabase:", error);
    } else {
        console.log("incluído com sucesso");
        // O Realtime listener faz o refresh automático
    }
});

// READ - Buscar um registro específico (Equivalente ao 'get')
buscar.addEventListener('click', async function(){
    if (varId.value === "") {
        alert("Por favor, preencha o campo Identificador.");
        return; 
    }
    
    // Select buscando exatamente a linha onde o 'id' bate
    const { data, error } = await supabase
        .from('Musicas')
        .select('*')
        .eq('id', varId.value)
        .single(); // Garante que retorna um único objeto em vez de um array

    if (data) {
        varTitulo.value = data.titulo;
        varArtista.value = data.artista;
    } else {
        alert("Não existe dado com este identificador");
        if (error) console.error("Detalhe do erro:", error.message);
    }
});

// UPDATE - Atualizar dados (Equivalente ao 'update')
atualizar.addEventListener('click', async function(){
    if (varId.value === "") {
        alert("Por favor, preencha o campo Identificador.");
        return; 
    }
    
    const { error } = await supabase
        .from('Musicas')
        .update({
            titulo: varTitulo.value,
            artista: varArtista.value
        })
        .eq('id', varId.value); // Cláusula WHERE essencial no SQL!
        
    if (error) {
        console.error("Erro ao atualizar dado no Supabase:", error);
    } else {
        console.log("atualizado com sucesso");
        // O Realtime listener faz o refresh automático
    }
});

// DELETE - Excluir dados (Equivalente ao 'remove')
excluir.addEventListener('click', async function(){
    if (varId.value === "") {
        alert("Por favor, preencha o campo Identificador.");
        return; 
    }
    
    const { error } = await supabase
        .from('Musicas')
        .delete()
        .eq('id', varId.value);
        
    if (error) {
         console.error("Erro ao excluir dado no Supabase:", error);
    } else {
         alert("excluído com sucesso");
         // O Realtime listener faz o refresh automático
    }
});
