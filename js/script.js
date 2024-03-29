/*Para la pre entrega 3, y como idea de proyecto, se trabaja bajo la necesidad de contar con una plataforma
que dependiendo la elección de gasto que la persona desea realizar,
la plataforma le recomienda posibilidades de pagar con tarjeta, en una cuota o más o elegir invertir en un fondo común de inversión*/

//creo clase para definir el plan
class Plan {
    //nombre del plan
    //tipo: 1 para Viaje, 2 para Electronica, 3 para Ropa, 4 para Otro
    //monto: importe
    //financiacion: 1 para 1 cuota sin interes, 2 para 6 cuotas con un interes, 3 para 12 cuotas
    constructor(nombre, tipo, monto, financiacion) {
        this.nombre = nombre;
        this.tipo = tipo;
        this.monto = parseFloat(monto);
        this.financiacion = financiacion;
        this.activo = true;
        this.detalleFinanciacion = [];
    }
    //agrego un metodo de activo, para que cuando tenga varios planes, poder simular entre los activos
    cambiarActivo(activo) {
        this.activo = activo;
        return this.activo
    }
    cambiarFinanciacion(financiacion) {
        this.financiacion = financiacion
        return this.financiacion
    }
    agregaDetalle(detalle) {
        this.detalleFinanciacion.push({
            cuotas: detalle.cuotas,
            interesTarjeta: detalle.interesTarjeta,
            detalleTarjeta: detalle.detalleTarjeta,
            interesInversion: detalle.interesInversion,
            detalleInversion: detalle.detalleInversion,
            valorTotal: detalle.valorTotal
        })
        return
    }
}

//class Usuario, para gestionar al perfil del inversor o cliente
class Usuario {
    constructor(nombre) {
        this.nombre = nombre;
        this.activo = true;
    }
    setNombre(nuevoNombre) {
        if (nombre != '') {
            this.nombre = nuevoNombre
            return this.nombre
        }
    }
    setActivo(activo) {
        this.activo = activo;
        return this.activo
    }
}

//busco en localStorage el objeto y hago un parse para que Javascript me devuelva un objeto
//eso es porque si guardo el nombre, brindo una mejor experiencia al inicio nuevamente
let usurioLocalStorage = JSON.parse(localStorage.getItem("usuario"))

if (usurioLocalStorage) { //Si Nombre tiene contenido, entonces lo muestro
    let usuario = new Usuario(usurioLocalStorage.nombre)
    asignarValoresInputs(usuario)
} else {
    let usuario = new Usuario('')
    asignarValoresInputs(usuario)
}

//para completar el combobox de tasas de intereses
llenarCombo("tasas-select", tasasInversion);

document.getElementById("impCheckDatos").addEventListener('change', almacenamientoDatos)

let botonEliminarTasa = document.getElementById("btn-eliminar-tasa");
botonEliminarTasa.addEventListener("click", () => {
    //recupero valor del combo    
    let combo = document.getElementById("tasas-select");
    let valorEliminar = combo.value; //El valor seleccionado
    let textoEliminar = combo.options[combo.selectedIndex].innerText; //El texto de la opción seleccionada
    eliminarTasa(tasasInversion, textoEliminar);
})

let botonAgregarTasa = document.getElementById("btn-agregar-tasa");
botonAgregarTasa.addEventListener("click", () => {
    let tasaNum = Number(document.getElementById("nueva-tasa-number").value);
    let tasaText = document.getElementById("nueva-tasa-text").value;
    nuevaTasa(tasaNum, tasaText, tasasInversion);
})

let simulaForm = document.getElementById("form-simulacion");
simulaForm.addEventListener("submit", validarFormulario);