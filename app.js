document.addEventListener("DOMContentLoaded", () => {
    // Variables
    const baseDeDatos = [{
            id: 1,
            nombre: "Lampara de techo",
            precio: 2500,
            imagen: "images/l3on.jpg",
            imagen1: "images/l3off.jpg",
        },
        {
            id: 2,
            nombre: "Lampara de techo Industrial",
            precio: 3500,
            imagen: "images/lamp2on.jpg",
            imagen1: "images/lamp2off.jpg",
        },
        {
            id: 3,
            nombre: "Lampara de mesa",
            precio: 4000,
            imagen: "images/lampon.jpg",
            imagen1: "images/lampoff.jpg",
        },

        {
            id: 4,
            nombre: "Lampara filamento industrial",
            precio: 7000,
            imagen: "images/lamp4on.jpg",
            imagen1: "images/lamp4off.jpg",
        },

        {
            id: 5,
            nombre: "Estante para cocina",
            precio: 8000,
            imagen: "images/estanteon.jpg",
            imagen1: "images/estanteoff.jpg",
        },

        {
            id: 6,
            nombre: "Set lamparas Plus",
            precio: 25000,
            imagen: "images/lamp5on.jpg",
            imagen1: "images/lamp5off.jpg",
        },
    ];

    let carrito = [];
    const divisa = "$";
    const DOMitems = document.querySelector("#items");
    const DOMcarrito = document.querySelector("#carrito");
    const DOMtotal = document.querySelector("#total");
    const DOMbotonVaciar = document.querySelector("#boton-vaciar");
    const miLocalStorage = window.localStorage;

    // Funciones

    /**
     * Dibuja todos los productos a partir de la base de datos.
     */
    function renderizarProductos() {
        baseDeDatos.forEach((info) => {
            // Estructura
            const miNodo = document.createElement("div");
            miNodo.classList.add("card", "col-sm-4");
            // Body
            const miNodoCardBody = document.createElement("div");
            miNodoCardBody.classList.add("card-body");
            // Titulo
            const miNodoTitle = document.createElement("h5");
            miNodoTitle.classList.add("card-title");
            miNodoTitle.textContent = info.nombre;
            // Imagen
            const miNodoImagen = document.createElement("img");
            miNodoImagen.classList.add("img-fluid", "rounded-md");
            miNodoImagen.setAttribute("src", info.imagen);
            /*  const image1 = miNodoImagen.setAttribute('src', info.imagen1); */

            // Precio
            const miNodoPrecio = document.createElement("p");
            miNodoPrecio.classList.add("card-text");
            miNodoPrecio.textContent = `${info.precio}${divisa}`;
            // Boton
            const miNodoBoton = document.createElement("button");
            miNodoBoton.classList.add("btn", "btn-primary");
            miNodoBoton.textContent = "+";

            miNodoBoton.setAttribute("marcador", info.id);
            miNodoBoton.addEventListener("click", anyadirProductoAlCarrito);

            /* Encendido y apagado imagen */
            function clicImgon() {
                miNodoImagen.setAttribute("src", info.imagen1);
                $("#p1").hide();
            }

            function clicImgoff() {
                miNodoImagen.setAttribute("src", info.imagen);
                $("#p1").show();
            }

            if (miNodoImagen.addEventListener("mouseover", clicImgoff)) {} else miNodoImagen.addEventListener("mouseout", clicImgon);

            // Insertamos
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);

            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }

    /**
     * Evento para añadir un producto al carrito de la compra
     */
    function anyadirProductoAlCarrito(evento) {
        // Anyadimos el Nodo a nuestro carrito
        carrito.push(evento.target.getAttribute("marcador"));
        // Actualizamos el carrito
        renderizarCarrito();
        // Actualizamos el LocalStorage
        guardarCarritoEnLocalStorage();
    }

    /**
     * Dibuja todos los productos guardados en el carrito
     */
    function renderizarCarrito() {
        // Vaciamos todo el html
        DOMcarrito.textContent = "";
        // Quitamos los duplicados
        const carritoSinDuplicados = [...new Set(carrito)];
        // Generamos los Nodos a partir de carrito
        carritoSinDuplicados.forEach((item) => {
            // Obtenemos el item que necesitamos de la variable base de datos
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                // ¿Coincide las id? Solo puede existir un caso
                return itemBaseDatos.id === parseInt(item);
            });
            // Cuenta el número de veces que se repite el producto
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
                return itemId === item ? (total += 1) : total;
            }, 0);
            // Creamos el nodo del item del carrito
            const miNodo = document.createElement("li");
            miNodo.classList.add("list-group-item", "text-right", "mx-2");
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa} 
            
            `;

            // Boton de borrar
            const miBoton = document.createElement("button");
            miBoton.classList.add("btn", "btn-success", "mx-5");
            miBoton.textContent = "X";
            miBoton.style.marginLeft = "1rem";
            miBoton.dataset.item = item;
            miBoton.addEventListener("click", borrarItemCarrito);
            // Mezclamos nodos
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
        // Renderizamos el precio total en el HTML
        DOMtotal.textContent = calcularTotal();
    }

    /**
     * Evento para borrar un elemento del carrito
     */
    function borrarItemCarrito(evento) {
        // Obtenemos el producto ID que hay en el boton pulsado
        const id = evento.target.dataset.item;
        // Borramos todos los productos
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        // volvemos a renderizar
        renderizarCarrito();
        // Actualizamos el LocalStorage
        guardarCarritoEnLocalStorage();
        /* Fecha */
    }

    /**
     * Calcula el precio total teniendo en cuenta los productos repetidos
     */
    function calcularTotal() {
        // Recorremos el array del carrito
        return carrito
            .reduce((total, item) => {
                // De cada elemento obtenemos su precio
                const miItem = baseDeDatos.filter((itemBaseDatos) => {
                    return itemBaseDatos.id === parseInt(item);
                });
                // Los sumamos al total
                return total + miItem[0].precio;
            }, 0)
            .toFixed(2);
    }

    /**
     * Varia el carrito y vuelve a dibujarlo
     */
    function vaciarCarrito() {
        // Limpiamos los productos guardados
        carrito = [];
        // Renderizamos los cambios
        renderizarCarrito();
        // Borra LocalStorage
        localStorage.clear();
    }

    function guardarCarritoEnLocalStorage() {
        miLocalStorage.setItem("carrito", JSON.stringify(carrito));
    }

    function cargarCarritoDeLocalStorage() {
        // ¿Existe un carrito previo guardado en LocalStorage?
        if (miLocalStorage.getItem("carrito") !== null) {
            // Carga la información
            carrito = JSON.parse(miLocalStorage.getItem("carrito"));
        }
    }

    // Eventos
    DOMbotonVaciar.addEventListener("click", vaciarCarrito);

    // Inicio
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
});



$(document).ready(function () {
    /* Lista de productos almacenada en github y llamada a traves de getJSON */
    $("#btproducto").click(function (e) {
        e.preventDefault();

        $("#productos").html("");
        $.getJSON(
            "https://raw.githubusercontent.com/owakester/getajax/main/productos.json",
            function (data) {
                //console.log(data);

                $.each(data, function (index, item) {
                    $("#productos").html(
                        $("#productos").html() +
                        `
                
                 <div class="row p-2"> 
                 <div class="col-3"> ${item.nombre}</div>
                 <div class="col-3"> ${item.medida}</div>
                 <div class="col-2"> ${item.Valor}</div>
                 <div class="col-4"> <img id="imgProd" class=" imgP rounded h-80 w-auto " src="${item.imagen}" ></div>
                 </div>
               
                 `
                    );
                });
            }
        );
    });
});

/* Mostrar Json de productos en github ajax y transiciones */
$(document).ready(function () {
    $("#colecciones").mouseenter(function (event) {
        $("#productos").fadeIn(1000);
    });

    $("#btproducto").mouseenter(function (event) {
        $("#productos").fadeOut(1000);
    });
});

/* Imprimir factura */
document.querySelectorAll(".printbutton").forEach(function (element) {
    element.addEventListener("click", function () {
        print();
    });
});