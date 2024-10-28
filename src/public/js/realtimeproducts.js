
const socket=io()

const nombreProducto = document.getElementById("productName")
const descripcionProducto = document.getElementById("productDesc")
const precioProducto = document.getElementById("productPrice")
const codigoProducto = document.getElementById("productCod")
const stockProducto = document.getElementById("productStock")
const categoriaProducto = document.getElementById("productCat")
const idProducto = document.getElementById("productId")
const container = document.getElementById("productListContainer");
const botonAgregar = document.getElementById("btn-add")
const botonEliminar = document.getElementById("btn-delete")

botonAgregar.addEventListener("click", e=>{
    e.preventDefault()
    if (nombreProducto.value.trim().length>0 &&
        descripcionProducto.value.trim().length>0 &&
        precioProducto.value.trim().length>0 &&
        codigoProducto.value.trim().length>0 &&
        stockProducto.value.trim().length>0 &&
        categoriaProducto.value.trim().length>0){
        botonAgregar.disabled = true;
        botonAgregar.textContent = "Guardando...";
        socket.emit("guardarProducto", {
            title: nombreProducto.value.trim(),
            description: descripcionProducto.value.trim(),
            code: codigoProducto.value.trim(),
            price: precioProducto.value.trim(),
            stock: stockProducto.value.trim(),
            category: categoriaProducto.value.trim()
        });
        nombreProducto.value = "";
        descripcionProducto.value = "";
        precioProducto.value = "";
        codigoProducto.value = "";
        stockProducto.value = "";
        categoriaProducto.value = "";
    }else{
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Para agregar un producto, tienes que completar todos los campos!"
          });
    }
})

botonEliminar.addEventListener("click", e=>{
    e.preventDefault()
    if (idProducto.value.trim().length>0){
        botonEliminar.disabled = true;
        botonEliminar.textContent = "Eliminando...";
        socket.emit("eliminarProducto", idProducto.value.trim())
        idProducto.value = "";
    }else{
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Para eliminar un producto, tienes que indicar el id del producto en cuestión!"
          });
    }
})

socket.on("listaProductos", (products) => {
    container.innerHTML = "";
    const ul = document.createElement("ul");
    ul.className = "ul-rtp";
    products.forEach(product => {
        const li = document.createElement("li");
        const imageUrl = product.thumbnails && product.thumbnails.length > 0 
            ? product.thumbnails[0] 
            : "https://qurystorage.s3.us-east-1.amazonaws.com/fotos/producto-sin-imagen.png";
        li.innerHTML = `
            <span>${product.category}</span>
            <h2>${product.title}</h2>
            <p>${product.description}</p>
            <img class="img-rtp" src="${imageUrl}" alt="${product.title}" />
            <p>Precio: $${product.price}</p>
            <span>${product.code}</span></br></br>
            <p>ID: ${product.id}</p>
        `;
        ul.appendChild(li);
    });
    container.appendChild(ul);
});

socket.on("productoEliminado", (data) => {
    Swal.fire({
        icon: "success",
        title: "Producto Eliminado",
        text: `Producto con ID ${data.id} eliminado.`,
    });
    botonEliminar.disabled = false;
    botonEliminar.textContent = "Eliminar";
    container.innerHTML = "";
});

socket.on("productoNoEncontrado", (data) => {
    console.error(`Error: ${data.error}`);
    Swal.fire({
        icon: "error",
        title: "Producto no encontrado",
        text: `Producto con ID ${data.id} no encontrado.`,
    });
    botonEliminar.disabled = false;
    botonEliminar.textContent = "Eliminar";
});

socket.on("errorEliminacion", (data) => {
    console.error(`Error al eliminar: ${data.error}`);
    Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al intentar eliminar el producto. Intenta de nuevo.",
    });
    botonEliminar.disabled = false;
    botonEliminar.textContent = "Eliminar";
});

socket.on("productoGuardado", (response) => {
    botonAgregar.disabled = false;
    botonAgregar.textContent = "Agregar";
    
    if (response.success) {
        Swal.fire({
            icon: "success",
            title: "Genial!",
            text: "Producto agregado correctamente"
        });
    } else {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al guardar el producto"
        });
    }
});