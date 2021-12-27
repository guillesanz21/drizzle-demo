module.exports = async callback => {

    try {
        const Asignatura = artifacts.require("./Asignatura.sol");

        // Usar las cuentas de usuario
        const accounts = await web3.eth.getAccounts();
        if (accounts.length < 8) {
            throw new Error("No hay cuentas.");
        }

        let asignatura = await Asignatura.deployed();

        // Identificar al owner
        let owner = await asignatura.owner();
        console.log("Cuenta del owner =", owner);

        // Añadir al owner como profesor:
        let profesor;
        try {
          profesor = await asignatura.profesores(0);
        } catch (e) {
          console.log("No hay profesores");
        }
        console.log("Añadiendo profesor...");
        if (profesor != owner) {
          await asignatura.addProfesor(owner, "Pepe Perez");
        }
        profesor = await asignatura.profesores(0);
        console.log("Cuenta del profesor =", profesor);

        console.log("Crear dos evaluaciones:");
        await asignatura.creaEvaluacion("Examen Parcial", 12345678, 30);
        await asignatura.creaEvaluacion("Examen Final", 12349999, 70);

        console.log("Matricular a dos alumnos:");
        let evaAccount = accounts[1];
        let pepeAccount = accounts[2];
        console.log("Cuenta de Eva =", evaAccount);
        console.log("Cuenta de Pepe =", pepeAccount);
        await asignatura.automatricula("Eva Martinez", "em@dominio.es", '00000001', {from: evaAccount});
        await asignatura.automatricula("Jose Redondo", "jr@stio.com", '00000002', {from: pepeAccount});

        console.log("Añadir calificaciones:");
        await asignatura.califica(evaAccount, 0, 1, 65);
        await asignatura.califica(evaAccount, 1, 1, 75);
        await asignatura.califica(pepeAccount, 0, 0, 0);
        await asignatura.califica(pepeAccount, 1, 1, 50);
    } catch (err) {   // Capturar errores
        console.log(`Error: ${err}`);
    } finally {
        console.log("FIN");
    }

    callback();      // Terminar
};
