
window.addEventListener("load", () => { Get(); });

function Get() {
    let request = new XMLHttpRequest();
    request.onreadystatechange = () => {
        if (request.readyState == 4) {

            let contenedor = document.getElementById("contenedor_carga");
            contenedor.style.visibility = 'hidden';
            contenedor.style.opacity = '0';

            if (request.status == 200) {
                let listaMaterias = JSON.parse(request.responseText);

                for (let i = 0; i < listaMaterias.length; i++) {

                    let tbody = document.getElementById("tbody");
                    let trow = document.createElement("tr");
                    trow.addEventListener("dblclick", () => { MostrarDatos(listaMaterias[i]) });   //se asignamos el evento click y llamamos a la funcion modificar del evento de la fila(row).  
                    let tdNombre = document.createElement("td");
                    let tdcuatrimestre = document.createElement("td");
                    let tdfechaFinal = document.createElement("td");
                    let tdturno = document.createElement("td");

                    tdNombre.appendChild(document.createTextNode(listaMaterias[i].nombre));
                    tdcuatrimestre.appendChild(document.createTextNode(listaMaterias[i].cuatrimestre));
                    tdfechaFinal.appendChild(document.createTextNode(listaMaterias[i].fechaFinal));
                    tdturno.appendChild(document.createTextNode(listaMaterias[i].turno));

                    trow.id = listaMaterias[i].id;
                    trow.appendChild(tdNombre);
                    trow.appendChild(tdcuatrimestre);
                    trow.appendChild(tdfechaFinal);
                    trow.appendChild(tdturno);

                    tbody.appendChild(trow);
                }
            }
            else {
                console.error(request.responseText);
            }
        }
        else {
            let contenedor = document.getElementById("contenedor_carga");
            contenedor.style.visibility = 'visible';
            contenedor.style.opacity = '100';
        }
    }
    request.open("GET", "http://localhost:3000/materias");
    request.send();
}

function MostrarDatos(materias) {

    let nombre = document.getElementById("idNombre");
    let cuatrimestre = document.getElementById("idCuatrimestre");
    let fechaFinal = document.getElementById("idFechaFinal");
    let turnoMañana = document.getElementById("idMañana");
    let turnoNoche = document.getElementById("idNoche");

    let modificar = document.getElementById("idModificar");
    let eliminar = document.getElementById("idEliminar");

    nombre.value = materias.nombre;
    cuatrimestre.value = materias.cuatrimestre;
    fechaFinal.value = materias.fechaFinal;

    if (materias.turno == "Mañana") {
        turnoMañana.checked = true;
    }
    else {
        turnoNoche.checked = true;
    }
    modificar.onclick = (e) => {
        Modificar(e, materias.id);
    };
    eliminar.onclick = (e) => {
        Eliminar(e, materias.id);
    };
}

function Eliminar(e, id) {

    e.preventDefault();
    let request = new XMLHttpRequest();
    request.onreadystatechange = () => {
        if (request.readyState == 4) {

            let contenedor = document.getElementById("contenedor_carga");
            contenedor.style.visibility = 'hidden';
            contenedor.style.opacity = '0';

            if (request.status == 200) {
                let tbody = document.getElementById("tbody");
                let tbody2 = document.createElement('tbody');
                tbody2.id = "tbody";
                tbody.parentNode.replaceChild(tbody2, tbody);
                Get();
            }
            else {
                console.error(request.responseText);
            }
        }
        else {
            let contenedor = document.getElementById("contenedor_carga");
            contenedor.style.visibility = 'visible';
            contenedor.style.opacity = '100';
        }
    }
    request.open("POST", "http://localhost:3000/eliminar");
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    request.send(JSON.stringify({ id }));
}

function Modificar(e, id) {

    e.preventDefault();
    let nombre = document.getElementById("idNombre").value;
    let cuatrimestre = document.getElementById("idCuatrimestre").value;
    let fechaFinal = document.getElementById("idFechaFinal").value;
    let turno = document.getElementById("idMañana").checked ? document.getElementById("idMañana") : document.getElementById("idNoche");

    let data = {
        id,
        nombre,
        cuatrimestre,
        fechaFinal,
        turno: turno.value
    }
    PostModificar(data, id);
}

function PostModificar(materias, id) {

    if (Validar(materias.nombre, materias.fechaFinal)) {

        let request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState == 4) {

                let contenedor = document.getElementById("contenedor_carga");
                contenedor.style.visibility = 'hidden';
                contenedor.style.opacity = '0';

                if (request.status == 200) {
                    let fila = document.getElementById(id);
                    let campos = fila.childNodes;
                    campos[0].textContent = materias.nombre;
                    campos[2].textContent = materias.fechaFinal;
                    campos[3].textContent = materias.turno;
                }
                else {
                    console.error(request.responseText);
                }
            }
            else {
                let contenedor = document.getElementById("contenedor_carga");
                contenedor.style.visibility = 'visible';
                contenedor.style.opacity = '100';
            }
        }
        request.open("POST", "http://localhost:3000/editar");
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request.send(JSON.stringify(materias));
    }
}

function Validar(nombre, fechaFinal) {

     let auxNombre = nombre.length >= 6;
     let auxfechaFinal = fechaFinal.value > Date.now();
     document.getElementById("idNombre").className = auxNombre ? "Ok": "Error";
     document.getElementById("idFechaFinal").className = auxfechaFinal ? "Ok": "Error";

    return auxNombre && auxfechaFinal;
}

