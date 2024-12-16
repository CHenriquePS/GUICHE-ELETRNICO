// Importação dos módulos Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, doc, orderBy } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD7bT6cBa0GTUK4S5Gxuh2BRLt82c0jM6k",
    authDomain: "guicheapp.firebaseapp.com",
    projectId: "guicheapp",
    storageBucket: "guicheapp.appspot.com",
    messagingSenderId: "403902467159",
    appId: "1:403902467159:android:f2e67d3c04e0d80ef4e712"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referência à coleção "fichas"
const fichasRef = collection(db, "fichas");

// Função para buscar e exibir os pacientes
async function fetchPatients() {
    try {
        const querySnapshot = await getDocs(fichasRef);
        const patientList = document.getElementById("patientList");
        patientList.innerHTML = ""; // Limpa a lista

        querySnapshot.forEach(doc => {
            const data = doc.data();
            const patientCard = document.createElement("div");
            patientCard.className = "patient-card";

            // Formata a urgência para exibir como texto
            const urgenciaCor = data.urgencia === "Emergencial" ? "#f44336" :
                               data.urgencia === "Urgente" ? "#ff9800" : "#4caf50";

            patientCard.innerHTML = `
                <h3 style="color: ${urgenciaCor}">${data.nome}</h3>
                <p><strong>CPF:</strong> ${data.cpf}</p>
                <p><strong>Idade:</strong> ${data.idade}</p>
                <p><strong>Urgência:</strong> ${data.urgencia}</p>
                <textarea id="sintomas-${doc.id}" placeholder="Sintomas"></textarea>
                <textarea id="diagnostico-${doc.id}" placeholder="Diagnóstico"></textarea>
                <button onclick="saveData('${doc.id}')">Salvar Informações</button>
            `;

            patientList.appendChild(patientCard);
        });
    } catch (error) {
        console.error("Erro ao buscar pacientes: ", error);
    }
}

// Função para salvar os sintomas e diagnóstico no Firestore
async function saveData(patientId) {
    const sintomas = document.getElementById(`sintomas-${patientId}`).value;
    const diagnostico = document.getElementById(`diagnostico-${patientId}`).value;

    const patientDoc = doc(db, "fichas", patientId);

    try {
        await updateDoc(patientDoc, {
            sintomas: sintomas,
            diagnostico: diagnostico
        });
        alert("Informações salvas com sucesso!");
        fetchPatients(); // Atualiza a lista de pacientes
    } catch (error) {
        console.error("Erro ao salvar informações: ", error);
        alert("Erro ao salvar informações. Tente novamente.");
    }
}

// Carrega a lista de pacientes ao iniciar
fetchPatients();
