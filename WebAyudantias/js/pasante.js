import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCZ4G1s-J8XyDrZ2NwmJ_fmbooVsndPC88",
  authDomain: "controlayudantiassal.firebaseapp.com",
  projectId: "controlayudantiassal",
  storageBucket: "controlayudantiassal.firebasestorage.app",
  messagingSenderId: "774566325891",
  appId: "1:774566325891:web:7f4ddf697094525ed3b5b6",
  measurementId: "G-2Z8K02KG3V"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Variables globales
let currentUserDocId = null;

// Esperar al usuario autenticado
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const usuariosSnapshot = await getDocs(collection(db, "usuarios"));
    usuariosSnapshot.forEach((docu) => {
      const data = docu.data();
      if (data.email === user.email && data.rol === "pasante") {
        currentUserDocId = docu.id;
        mostrarReportesPasante(currentUserDocId); // Mostrar reportes
      }
    });
  } else {
    window.location.href = "login.html";
  }
});

// Registrar ayudantía
document.getElementById("registerAssistanceForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fecha = document.getElementById("date").value;
  const asistentes = parseInt(document.getElementById("attendees").value);
  const temas = document.getElementById("topics").value;

  // Obtener horaEntrada del formulario
  const horaEntrada = document.getElementById("horaEntrada").value;

  // Hora de salida es opcional, se obtiene si se ha proporcionado
  const horaSalida = document.getElementById("horaSalida").value || "";

  // Validación de campos
  if (!fecha || isNaN(asistentes) || !temas || !horaEntrada || !currentUserDocId) {
    alert("Por favor completa todos los campos.");
    return;
  }

  try {
    // Crear el reporte en la base de datos
    await addDoc(collection(db, "reportes"), {
      IdPasante: doc(db, "usuarios", currentUserDocId),
      Fecha: fecha,
      HoraEntrada: horaEntrada,
      HoraSalida: horaSalida,
      CantidadAsistentes: asistentes,
      TemasTratados: temas
    });

    // Alerta de éxito
    alert("Reporte registrado correctamente.");
    
    // Resetear el formulario y actualizar la tabla de reportes
    document.getElementById("registerAssistanceForm").reset();
    mostrarReportesPasante(currentUserDocId); // Actualizar la tabla
  } catch (error) {
    console.error("Error al guardar el informe:", error);
    alert("Ocurrió un error al registrar la ayudantía.");
  }
});

// Mostrar reportes del pasante
async function mostrarReportesPasante(pasanteId) {
  const reportesQuery = query(collection(db, "reportes"), where("IdPasante", "==", doc(db, "usuarios", pasanteId)));
  const reportesSnapshot = await getDocs(reportesQuery);

  const tbody = document.getElementById("reportesTableBody");
  tbody.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos reportes

  reportesSnapshot.forEach((docu) => {
    const data = docu.data();
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${data.Fecha}</td>
      <td>${data.HoraEntrada || "-"}</td>
      <td>${data.HoraSalida || "-"}</td>
      <td>${data.CantidadAsistentes}</td>
      <td>${data.TemasTratados}</td>
      <td>${data.Calificacion || "-"}</td>  <!-- Nuevo campo Calificación -->
      <td>${data.Observacion || "-"}</td>   <!-- Nuevo campo Observación -->
    `;

    tbody.appendChild(fila);
  });
}


// Cerrar sesión
document.getElementById("logoutButton").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
});

