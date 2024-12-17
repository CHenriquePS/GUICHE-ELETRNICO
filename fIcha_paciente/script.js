import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD7bT6cBa0GTUK4S5Gxuh2BRLt82c0jM6k",
    authDomain: "guicheapp.firebaseapp.com",
    projectId: "guicheapp",
    storageBucket: "guicheapp.appspot.com",
    messagingSenderId: "403902467159",
    appId: "1:403902467159:android:f2e67d3c04e0d80ef4e712"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const fichasRef = collection(db, "fichas");

const patientList = document.getElementById("patientList");
const modal = document.getElementById("patientModal");
const closeModal = document.getElementById("closeModal");
const saveButton = document.getElementById("saveButton");

let selectedPatientId = null;

async function fetchPatients() {
    try {
        const querySnapshot = await getDocs(fichasRef);
        patientList.innerHTML = "";

        querySnapshot.forEach(docSnapshot => {
            const data = docSnapshot.data();
            const button = createPatientButton(data, docSnapshot.id);
            patientList.appendChild(button);
        });
    } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
    }
}

function createPatientButton(data, id) {
    const button = document.createElement("button");
    button.className = "patient-button " + getUrgencyClass(data.urgencia);
    button.textContent = data.nome;
    button.addEventListener("click", () => openModal(data, id));
    return button;
}

function getUrgencyClass(urgency) {
    const urgencyClasses = {
        "Emergencial": "emergencial",
        "Urgente": "urgente",
        "Normal": "normal"
    };
    return urgencyClasses[urgency] || "normal";
}

function openModal(data, id) {
    selectedPatientId = id;
    document.getElementById("modalName").textContent = data.nome;
    document.getElementById("modalCPF").textContent = data.cpf;
    document.getElementById("modalIdade").textContent = data.idade;
    document.getElementById("modalUrgencia").textContent = data.urgencia;
    document.getElementById("modalSintomas").value = data.sintomas || "";
    document.getElementById("modalDiagnostico").value = data.diagnostico || "";
    modal.style.display = "flex";
}

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
    resetModal();
});

saveButton.addEventListener("click", async () => {
    const sintomas = document.getElementById("modalSintomas").value;
    const diagnostico = document.getElementById("modalDiagnostico").value;

    if (!selectedPatientId) return;

    try {
        await updateDoc(doc(db, "fichas", selectedPatientId), { sintomas, diagnostico });
        alert("Informações salvas com sucesso!");
        closeModal.click();
        fetchPatients();
    } catch (error) {
        console.error("Erro ao salvar:", error);
        alert("Erro ao salvar as informações. Tente novamente.");
    }
});

function resetModal() {
    document.getElementById("modalName").textContent = "";
    document.getElementById("modalCPF").textContent = "";
    document.getElementById("modalIdade").textContent = "";
    document.getElementById("modalUrgencia").textContent = "";
    document.getElementById("modalSintomas").value = "";
    document.getElementById("modalDiagnostico").value = "";
    selectedPatientId = null;
}

document.addEventListener("DOMContentLoaded", fetchPatients);
