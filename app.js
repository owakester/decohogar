//variables

const carrito = document.querySelector("#IrVentanaFlotante"); /* carrito */
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarcarritoBtn = document.querySelector("#vaciar-carrito");
const listaCursos = document.querySelector("#lista-cursos");

let articulosCarrito = [];
cargarEventListener();
function cargarEventListener() {
  /* Cuando agregas un curso pulsando agregar */
  listaCursos.addEventListener("click", agregarCurso);
}

/* Funciones */

function agregarCurso(e) {
  e.preventDefault();

  if (e.target.classList.contains("agregar-carrito")) {
    const cursoSeleccionado = e.target.parentElement.parentElement;
    leerDatosCurso(cursoSeleccionado);
  }
}

/* lee el contenido del html al que le dimos clic y extrae info del curso */

function leerDatosCurso(curso) {
  /* console.log(curso) */

  //crear objeto con contenido curso

  const infoCurso = {
    Titulo: curso.querySelector("h3").textContent,
    Precio: curso.querySelector(".precio span").textContent,
    imagen: curso.querySelector("img").src,
    id: curso.querySelector(".precio a").getAttribute("data-id"),
    cantidad: 1,
  };

  //agrega elementos al carrito
  articulosCarrito = [...articulosCarrito, infoCurso];

  console.log(articulosCarrito);
  carritoHTML();
}

//muestra el carrito de compras en el html

function carritoHTML() {
  articulosCarrito.forEach(curso => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>
            ${curso.Titulo}
        </td>
    `;

    //Agrega html de carrito e tbody
    contenedorCarrito.appendChild(row);
  });
}
