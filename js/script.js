/*Para la pre entrega 2, y como idea de proyecto, se trabaja bajo la necesidad de contar con una plataforma
que dependiendo la elección de gasto que la persona desea realizar,
la plataforma le recomienda posibilidades de pagar con tarjeta, en una cuota o más o elegir invertir en un fondo común de inversión*/

const mensajeSalida = "salir" //para salir de la ejecucion
const planes = []; //array de planes para que en proxima version pueda tener varios planes
const inflacion = 0.95; //anual

//agrego el arrays días para comparar, los días sabado y domingo no se permite realizar inversiones, por eso tienen en inversion false
const dias = [{
    descripcion: "lunes",
    valor: 1,
    inversion: true
}, {
    descripcion: "martes",
    valor: 2,
    inversion: true
}, {
    descripcion: "miércoles",
    valor: 3,
    inversion: true
}, {
    descripcion: "jueves",
    valor: 4,
    inversion: true
}, {
    descripcion: "viernes",
    valor: 5,
    inversion: true
}, {
    descripcion: "sábado",
    valor: 6,
    inversion: false
}, {
    descripcion: "domingo",
    valor: 7,
    inversion: false
}];


//muestro las opciones de inversion
let tasasInversion = [{
    descripcion: "Plazo Fijo",
    valor: 0.75
}, {
    descripcion: "Fondo Común",
    valor: 0.62
}];
//muestro las opciones de financiamiento en tarjeta
const tasasTarjetas = [{
    descripcion: "1 Cuota",
    cantidad: 1,
    valor: 0
}, {
    descripcion: "6 Cuotas",
    cantidad: 6,
    valor: 0.15
}, {
    descripcion: "12 Cuotas",
    cantidad: 12,
    valor: 0.24
}];

//variables de eleccion de viaje
let nombre = "";
let eleccion = 0;
let eleccionLetras = "";
let nombrePlan = "";
let cantidadCuotas = 0;
let eleccionCuotas = "";
let montoGasto = 0;


//funciones
//como el calculo de interes es igual, se utiliza para gasto, como para ganancia
let interes = (importe, interes, cantidadMeses) => {
    let valorResultado = 0
    for (let i = 1; i <= cantidadMeses; i++) {
        valorResultado += (importe * (interes / 12))
    }
    return valorResultado
}

//funciones de orden superior
//para calcular si la ganancia es mayor que la inflacion
function mayorQue(n) {
    return (m) => m > n
}
//si con la ganancia de los intereses le gano a la inflacion
let mayorQueInflacion = mayorQue(inflacion)

let calcular = () => {
    /*la idea es que: no importa las cuotas que seleccione el usuario
    pero en base a las opciones, mostrarle al usuario las ventajas de invertir el dinero en un plazo fijo
    o en un fondo común de inversión o la opción que agregue y con el valor de los intereses pagar la cuota.
    Esto es recomendable, siempre y cuando el valor de las cuotas no supere el valor de inflación*/
    mensaje = ""
    let totalMenor = 0;
    let mejorTasaValor = 0;
    let mejorTasaDescripcion = "";
    for (const planCalculo of planes) {
        if (planCalculo.activo) {
            //tengo un plan activo, el cual debo calcular el interes y el costo de las tasas de inversion y de tarjeta
            //primero calculo las tarjetas, las tasas estan en el array tasasTarjetas
            let valorCuota = [];
            for (let index = 0; index < tasasTarjetas.length; index++) {
                valorCuota[index] = interes(parseFloat(planCalculo.monto), parseFloat(tasasTarjetas[index].valor), parseFloat(tasasTarjetas[index].cantidad));
                //por cada cantidad de cuotas, recorro la inversion y calculo cuanto ganaria de interes, salvo para 1 cuota que no tiene intereses
                for (const tasa of tasasInversion) {
                    valorInversion = interes(parseFloat(planCalculo.monto), parseFloat(tasa.valor), parseFloat(tasasTarjetas[index].cantidad));
                    let detalleFinanciacion = {
                        cuotas: tasasTarjetas[index].cantidad,
                        interesTarjeta: valorCuota[index],
                        detalleTarjeta: tasasTarjetas[index].descripcion,
                        interesInversion: valorInversion,
                        detalleInversion: tasa.descripcion,
                        valorTotal: valorCuota[index] + planCalculo.monto - valorInversion
                    };
                    planCalculo.agregaDetalle(detalleFinanciacion);
                    if (totalMenor == 0) {
                        totalMenor = (valorCuota[index] + planCalculo.monto - valorInversion)
                        mejorTasaValor = tasa.valor;
                        mejorTasaDescripcion = tasa.descripcion;
                        mensaje = "La mejor alternativa es la opción de abonar con " + tasasTarjetas[index].descripcion + " y realizando la inversion de: " + tasa.descripcion + ", si restamos las ganancias el total pagado es de " + totalMenor
                    } else if ((valorCuota[index] + planCalculo.monto - valorInversion) < totalMenor) {
                        totalMenor = (valorCuota[index] + planCalculo.monto - valorInversion)
                        mejorTasaValor = tasa.valor;
                        mejorTasaDescripcion = tasa.descripcion;
                        mensaje = "La mejor alternativa es la opción de abonar con " + tasasTarjetas[index].descripcion + " y realizando la inversion de: " + tasa.descripcion + ", si restamos las ganancias el total pagado es de " + totalMenor
                    }
                }
            }
        }
    }
    let valorCondicion = mayorQueInflacion(mejorTasaValor)
    if (valorCondicion == true) {
        mensaje += "\nCon esta inversión además, le estás ganando a la inflación proyectada del año que es del " + (inflacion * 100) + "%. Excelente noticia!!"
    } else {
        mensaje += "\nCon esta inversión, No le estás ganando a la inflación proyectada del año que es del " + (inflacion * 100) + "%, pero te das un gusto :D"
    }
    informe(mensaje);
}

let informe = (mensajeFinal) => {
    alert(mensajeFinal)
    //Date para buscar el día de hoy
    const hoy = new Date();
    const hoyDia = hoy.getDay(hoy); //1 es lunes y 7 domingo
    let diaAptoInversion = dias.find((dia) => dia.valor === hoyDia);
    if (diaAptoInversion.inversion == true) {
        alert("Recorda que hoy es " + diaAptoInversion.descripcion + " y es un día hábil para invertir tu dinero")
    } else {
        alert("Recorda que hoy es " + diaAptoInversion.descripcion + " y No podes invertir tu dinero, agenda la inversión para el próximo día hábil")
    }

    let impResultado = document.getElementById("resultado-simulacion");
    impResultado.innerHTML = mensajeFinal;

}

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

//for para mostrar los valores por defecto de las tasas
let tasaMensaje = (tasaReferencia) => {
    let mensajeAuxiliar = ""
    for (let index = 0; index < tasaReferencia.length; index++) {
        if (mensajeAuxiliar.trim() == "") {
            mensajeAuxiliar += (tasaReferencia[index].descripcion + " " + (tasaReferencia[index].valor * 100) + "%")
        } else {
            mensajeAuxiliar += ("\n" + tasaReferencia[index].descripcion + " " + (tasaReferencia[index].valor * 100) + "%")
        }
    }
    return mensajeAuxiliar
}

let nuevaTasa = (tasaReferencia) => {
    do {
        nuevaTasaPorcentaje = Number(prompt(`Por favor, en el rango de 0 (cero) a 100(cien), ingrese el valor de la tasa de refencia, correspondiente a la Tasa Nominal Anual (TNA)`));
    } while (!((nuevaTasaPorcentaje / 100) >= 0 && (nuevaTasaPorcentaje / 100) <= 1));
    do {
        nuevaTasaDescripcion = prompt(`Por favor, ingrese el nombre que identifica a la tasa de refencia`);
    } while (nuevaTasaDescripcion.trim() == "");
    tasaReferencia.push({
        descripcion: nuevaTasaDescripcion,
        valor: (nuevaTasaPorcentaje / 100)
    })
}

let eliminarTasa = (tasaReferencia) => {
    let mensajeEleccion = tasaMensaje(tasaReferencia)
    let contadorBorrado = 0
    do {
        tasaEliminar = prompt(`Por favor, de las siguientes tasas:\n ${mensajeEleccion} \nIngrese el nombre de la tasa a eliminar, \nDe lo contrario, escriba ${mensajeSalida} para abandonar el borrado y continuar`);
    } while (tasaEliminar.trim() == "");

    if (tasaEliminar.toLowerCase() != mensajeSalida) {
        index = tasaReferencia.findIndex(i => i.descripcion === tasaEliminar)
        //si existe, o sea, es distinto a -1, lo borro con splice
        if (index != -1) {
            tasaReferencia.splice(index, 1)
            contadorBorrado++
        }
    }

    if (contadorBorrado > 0) {
        alert("Perfecto, la tasa se borro correctamente")
    } else {
        alert("No se encontró la tasa a borrar")
    }
    return tasaReferencia
}

let controlTasaInversion = (tasasInversion) => {
    let mensajeEleccion = tasaMensaje(tasasInversion)
    let control = false;
    do {
        eleccionTasa = Number(prompt(`Para la siguiente simulación, vamos a trabajar con los siguientes valores de inversión\n${mensajeEleccion}\nEscriba\n1 - Para continuar\n2 - Para agregar una nueva tasa al listado\n3 - Para eliminiar una tasa del listado anterior`));
        switch (eleccionTasa) {
            case 1:
                //continuo con las dos tasas ingresadas por defecto
                control = true;
                break;
            case 2:
                //agrego una nueva tasa
                control = true;
                nuevaTasa(tasasInversion);
                break;
            case 3:
                //elimino una de las tasas - si o si, debe existir una tasa, para la simulacion
                control = true;
                tasasInversion = eliminarTasa(tasasInversion);
                break;
            default:
                //opcion incorrecta, debe ingresar un valor correcto
                break;
        }
    } while ((control == false));
    mensajeEleccion = tasaMensaje(tasasInversion)
    alert(`Continuamos con las siguientes tasas:\n ${mensajeEleccion}`)
}

//alert("Bienvenido a la plataforma de decisión financiera");

//solicitud de nombre, para pertenencia en el resultado
//validacion de nombre de la persona con do while

/*
Inicio Agregado control por form
*/

let simulaForm = document.getElementById("form-simulacion");
simulaForm.addEventListener("submit", validarFormulario);

function validarFormulario(e){
    e.preventDefault();
    // let nomPersona = document.getElementById("impNomPersona");
    // let SelDeseo = document.getElementById("impSelDeseo");
    // let nomPlan = document.getElementById("impNomPlan");
    // let precioPlan = document.getElementById("impPrecioPlan");
    // let cantCuotas = document.getElementById("impSelCantCuotas");
    // let checkDatos = document.getElementById("impCheckDatos");

    // //Obtenemos el elemento desde el cual se disparó el evento
    // let formulario = e.target
    // //Obtengo el valor del primero hijo <input type="text">
    // console.log(formulario.children[0].value);
    // //Obtengo el valor del segundo hijo <input type="number"> 
    // console.log(formulario.children[1].value);

    datos(e)

}

function datos(e) {
    let mensajeError = ""

    nombre = e.srcElement[0].value;
    if (nombre.trim() == "") {
        mensajeError = "Por favor, ingresa un nombre válido para continuar";
    }
    if ((nombre.trim() != "") && (nombre.toLowerCase() != mensajeSalida)) {
        //casteo el numero de la eleccion, por defecto es el valor 0 (sin eleccion) y se asigna nombre otros, de lo contrario se establece entre las opciones
        eleccion = Number(e.srcElement[1].value);
        switch (eleccion) {
            case 1:
                eleccionLetras = "Viaje";
                break;
            case 2:
                eleccionLetras = "Electronica";
                break;
            case 3:
                eleccionLetras = "Ropa";
                break;
            case 4:
                eleccionLetras = "Otro";
                break;
            default:
                //por el momento dejo la opcion por defecto, puede ser una categoria otros e ingresar algun nombre o cambiar la logica para elegir entre el combo anterior
                eleccionLetras = "Otra opción";
                break;
        }
        if (eleccion >= 1 && eleccion <= 4) {
            //definir un nombre del plan para hacerlo mas personalizado
            nombrePlan = e.srcElement[2].value;
            if (nombrePlan.trim() == "") {
                mensajeError = `Necesitamos un poco más de información ¿Cómo llamarías a tu plan de la categoría: ${eleccionLetras}?`
            }
            //validacion de monto con do while, por defecto el programa funcionara si el valor es entre 1000 y 2 millones, de lo contrario no continua
            //se establece el supuesto que mayor a 2 millones debe contratar un plan personalizado que no se plantea es esta etapa
        
            montoGasto = Number(e.srcElement[3].value);
                if (typeof (montoGasto) != "number") {
                    mensajeError = "Ingrese un valor de tipo numerico";
                } else if (montoGasto >= 1000 && montoGasto <= 2000000) {
                    //puedo trabajar en el asesoramiento

                        cantidadCuotas = Number(e.srcElement[4].value);
                        switch (cantidadCuotas) {
                            case 1:
                                eleccionCuotas = "1 Cuota";
                                break;
                            case 2:
                                eleccionCuotas = "6 Cuotas";
                                break;
                            case 3:
                                eleccionCuotas = "12 Cuotas";
                                break;
                            default:
                                mensajeError = "Cantidad incorrecta, por favor vuelva a selecionar entre las opciones correctas";
                                break;
                        }

                    alert("Perfecto, vamos a ayudarte en tu plan " + eleccionLetras + " de nombre " + nombrePlan + " por un total de " + montoGasto.toString() + " y en " + eleccionCuotas);
                    //cargo la informacion y creo el plan, podría crear varios, estilo carrito de compras y calcular varios planes y un plan general.
                    planes.push(new Plan(nombre, eleccion, montoGasto, cantidadCuotas));
                    //Para controlar si el usuario desea agregar una nueva tasa o eliminar otra
                    controlTasaInversion(tasasInversion);
                    calcular();
                } else {
                    let esMayor = (montoGasto > 2000000)
                    if (esMayor) {
                        mensajeError = "Lamentamos no poder ayudarte, estamos trabajando para lograr asesorarte en montos grandes de dinero, superiores a 2 millones";
                    } else {
                        mensajeError = "Lamentamos no poder ayudarte, el monto es menor a $1000 \nRecorda que podemos ayudarte en valores mayores o iguales a 1000 y menor o igual a 2 millones";
                    }
                }
            }
        
        } else {
            alert("Seleccionaste una opción incorrecta, por lo que no podemos ayudarte");
        }
    
    
    let impResultadoError = document.getElementById("error-simulacion");
    impResultadoError.innerHTML = mensajeError;
    
}

/*
Fin Agregado control por form
*/

// do {
//     nombre = prompt(`Por favor, ingresa tu nombre para continuar \nEscriba ${mensajeSalida} para abandonar el programa`);
//     if (nombre.trim() == "") {
//         alert(`Por favor, ingresa un nombre válido para continuar \nEscriba ${mensajeSalida} para abandonar el programa`);
//     } else if (nombre.toLowerCase() == mensajeSalida) {
//         break
//     }
// } while (nombre.trim() == "");
// if ((nombre.trim() != "") && (nombre.toLowerCase() != mensajeSalida)) {
//     //casteo el numero de la eleccion, por defecto es el valor 0 (sin eleccion) y se asigna nombre otros, de lo contrario se establece entre las opciones
//     eleccion = Number(prompt("Contanos " + nombre + ", ¿cuál es tu deseo financiero? Ingresa el número de la opción para continuar \nIngresa 1 para Viaje, \nIngresa 2 para Electronica, \nIngresa 3 para Ropa, \nIngresa 4 para Otro"));
//     switch (eleccion) {
//         case 1:
//             eleccionLetras = "Viaje";
//             break;
//         case 2:
//             eleccionLetras = "Electronica";
//             break;
//         case 3:
//             eleccionLetras = "Ropa";
//             break;
//         case 4:
//             eleccionLetras = "Otro";
//             break;
//         default:
//             //por el momento dejo la opcion por defecto, puede ser una categoria otros e ingresar algun nombre o cambiar la logica para elegir entre el combo anterior
//             eleccionLetras = "Otra opción";
//             break;
//     }
//     if (eleccion >= 1 && eleccion <= 4) {
//         //definir un nombre del plan para hacerlo mas personalizado
//         nombrePlan = prompt(`Necesitamos un poco más de información ¿Cómo llamarías a tu plan de la categoría: ${eleccionLetras}?`);
//         while (nombrePlan.trim() == "") {
//             nombrePlan = prompt(`Necesitamos un poco más de información ¿Cómo llamarías a tu plan de la categoría: ${eleccionLetras}?`);
//         }
//         //validacion de monto con do while, por defecto el programa funcionara si el valor es entre 1000 y 2 millones, de lo contrario no continua
//         //se establece el supuesto que mayor a 2 millones debe contratar un plan personalizado que no se plantea es esta etapa
//         do {
//             montoGasto = Number(prompt("¿Cuál es el monto total del gasto que deseas para " + nombrePlan + "? \nRecorda que solamente podemos ayudarte, si ingresas valores entre 1000 (mil) y 2 millones"));
//             if (typeof (montoGasto) != "number") {
//                 alert("Ingrese un valor de tipo numerico")
//             } else if (montoGasto >= 1000 && montoGasto <= 2000000) {
//                 //puedo trabajar en el asesoramiento
//                 do {
//                     cantidadCuotas = Number(prompt("Contanos, ¿en cuantas cuotas pensas financiarlo? Ingresa el número de la opción para continuar \nIngresa 1 para 1 cuota sin interes, \nIngresa 2 para 6 cuotas" + "\nIngresa 3 para 12 cuotas"));
//                     switch (cantidadCuotas) {
//                         case 1:
//                             eleccionCuotas = "1 Cuota";
//                             cantidadCorrecta = true;
//                             break;
//                         case 2:
//                             eleccionCuotas = "6 Cuotas";
//                             cantidadCorrecta = true;
//                             break;
//                         case 3:
//                             eleccionCuotas = "12 Cuotas";
//                             cantidadCorrecta = true;
//                             break;
//                         default:
//                             eleccionCuotas = "Cantidad incorrecta, por favor vuelva a selecionar entre las opciones correctas";
//                             cantidadCorrecta = false;
//                             break;
//                     }
//                 }
//                 while (cantidadCorrecta == false);
//                 alert("Perfecto, vamos a ayudarte en tu plan " + eleccionLetras + " de nombre " + nombrePlan + " por un total de " + montoGasto.toString() + " y en " + eleccionCuotas);
//                 //cargo la informacion y creo el plan, podría crear varios, estilo carrito de compras y calcular varios planes y un plan general.
//                 planes.push(new Plan(nombre, eleccion, montoGasto, cantidadCuotas));
//                 //Para controlar si el usuario desea agregar una nueva tasa o eliminar otra
//                 controlTasaInversion(tasasInversion);
//                 calcular();
//             } else {
//                 let esMayor = (montoGasto > 2000000)
//                 if (esMayor) {
//                     alert("Lamentamos no poder ayudarte, estamos trabajando para lograr asesorarte en montos grandes de dinero, superiores a 2 millones");
//                 } else {
//                     alert("Lamentamos no poder ayudarte, el monto es menor a $1000 \nRecorda que podemos ayudarte en valores mayores o iguales a 1000 y menor o igual a 2 millones");
//                 }
//             }
//         }
//         while (montoGasto == 0);
//     } else {
//         alert("Seleccionaste una opción incorrecta, por lo que no podemos ayudarte");
//     }
// }


// let botonSimular = document.getElementById("btn-simular");

// botonSimular.addEventListener("click", () => {
//     alert("Es una prueba");
// })