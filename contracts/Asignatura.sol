// Grupo:
// Guillermo Sanz González
// Javier Contreras Fernández-Cid

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

/**
 * El contrato Asignatura que representa una asignatura de la carrera.
 *
 * Version 2021 - Clased de Teoria
 */

contract Asignatura {
    /// Version 2021 - Teoria
    uint256 public version = 2021;

    // address del que ha desplegado el contrato.
    address public owner;

    // // address del profesor
    // address public profesor;

    // Direccion del coordinador de la asignatura
    address public coordinador;

    // Flag del estado de la asignatura
    bool public cerrada;

    /// Nombre de la asignatura
    string public nombre;

    // Curso academico
    string public curso;

    /**
     * Datos de una evaluacion.
     */
    struct Evaluacion {
        string nombre;
        uint256 fecha;
        uint256 puntos;
    }

    /// Evaluaciones de la asignatura.
    Evaluacion[] public evaluaciones;

    /// Datos de un alumno.
    struct DatosAlumno {
        string nombre;
        string email;
        string DNI;
    }

    /// Acceder a los datos de un alumno dada su direccion.
    mapping(address => DatosAlumno) public datosAlumno;
    mapping(address => string) public DNIAlumno;

    /// Acceder a los datos de un profesor dada su direccion.
    mapping(address => string) public datosProfesor;

    // Array con las direcciones de los alumnos matriculados.
    address[] public matriculas;

    // Lista de profesores incluidos en la asignatura
    address[] public profesores;

    /// Tipos de notas: no presentado, nota entre 0 y 10, y matricuka de honor.
    enum TipoNota {
        NP,
        Normal,
        MH
    }

    /**
     * Datos de una nota.
     * La calificacion esta multipilicada por 100 porque no hay decimales.
     */
    struct Nota {
        TipoNota tipo;
        uint256 calificacion;
    }

    // Dada la direccion de un alumno, y el indice de la evaluacion, devuelve
    // la nota del alumno.
    mapping(address => mapping(uint256 => Nota)) public calificaciones;

    // Error que notifica cuando un alumno con DNI ya registrado intenta automatricularse
    error AlumnoYaMatriculado(string nombre, string email, string dni);

    /**
     * Constructor.
     *
     * @param _nombre Nombre de la asignatura.
     * @param _curso Curso academico.
     */
    constructor(string memory _nombre, string memory _curso) {
        bytes memory bn = bytes(_nombre);
        require(
            bn.length != 0,
            "El nombre de la asignatura no puede ser vacio"
        );

        bytes memory bc = bytes(_curso);
        require(
            bc.length != 0,
            "El curso academico de la asignatura no puede ser vacio"
        );
        coordinador = msg.sender;
        owner = msg.sender;
        cerrada = false;
        nombre = _nombre;
        curso = _curso;
    }

    /**
     * El numero de evaluaciones creadas.
     *
     * @return El numero de evaluaciones creadas.
     */
    function evaluacionesLength() public view returns (uint256) {
        return evaluaciones.length;
    }

    /**
     * Crear una prueba de evaluacion de la asignatura. Por ejemplo, el primer parcial, o la
    practica 3.
     *
     * Las evaluaciones se meteran en el array evaluaciones, y nos referiremos a ellas por su
    posicion en el array.
     *
     * @param _nombre El nombre de la evaluacion.
     * @param _fecha La fecha de evaluacion (segundos desde el 1/1/1970).
     * @param _puntos Los puntos que proporciona a la nota final.
     *
     * @return La posicion en el array evaluaciones,
     */
    function creaEvaluacion(
        string memory _nombre,
        uint256 _fecha,
        uint256 _puntos
    ) public soloCoordinador soloAbierta returns (uint256) {
        bytes memory bn = bytes(_nombre);
        require(
            bn.length != 0,
            "El nombre de la evaluacion no puede ser vacio"
        );

        evaluaciones.push(Evaluacion(_nombre, _fecha, _puntos));
        return evaluaciones.length - 1;
    }

    /**
     * El numero de alumnos matriculados.
     *
     * @return El numero de alumnos matriculados.
     */
    function matriculasLength() public view returns (uint256) {
        return matriculas.length;
    }

    /**
     * Los alumnos pueden automatricularse con el metodo automatricula.
     *
     * Impedir que se pueda meter un nombre vacio.
     *
     * @param _nombre El nombre del alumno.
     * @param _email El email del alumno.
     */
    function automatricula(
        string memory _nombre,
        string memory _email,
        string memory _DNI
    ) public noMatriculados soloAbierta {
        bytes memory b_name = bytes(_nombre);
        bytes memory b_DNI = bytes(_DNI);
        require(b_name.length != 0, "El nombre no puede ser vacio");
        require(b_DNI.length != 0, "El DNI del alumno no puede estar vacio");
        //  require(b_DNI.length == 0, "Alumno ya matriculado");
        if (bytes(DNIAlumno[msg.sender]).length > 0) {
            revert AlumnoYaMatriculado({
                nombre: _nombre,
                email: _email,
                dni: _DNI
            });
        }
        //for (uint i = 0; i < matriculas.length; i++) {
        //    if (compareStrings(datosAlumno[matriculas[i]].DNI, _DNI)) {
        //        revert AlumnoYaMatriculado({nombre: _nombre, email: _email, dni: _DNI});
        //    }
        //}
        //  bytes memory b_DNI = bytes(datosAlumno[msg.sender].DNI);
        // if (b_DNI.length != 0) {
        //     revert AlumnoYaMatriculado({nombre: _nombre, email: _email, dni: _DNI});
        // }

        DatosAlumno memory datos = DatosAlumno(_nombre, _email, _DNI);
        DNIAlumno[msg.sender] = _DNI;
        datosAlumno[msg.sender] = datos;

        matriculas.push(msg.sender);
    }

    function compareStrings(string memory a, string memory b)
        public
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    /**
     * Permite a un alumno obtener sus propios datos.
     *
     * @return _nombre El nombre del alumno que invoca el metodo.
     * @return _email El email del alumno que invoca el metodo.
     * @return _DNI El DNI del alumno que invoca el metodo.
     */
    function quienSoy()
        public
        view
        soloMatriculados
        returns (
            string memory _nombre,
            string memory _email,
            string memory _DNI
        )
    {
        DatosAlumno memory datos = datosAlumno[msg.sender];
        _nombre = datos.nombre;
        _email = datos.email;
        _DNI = datos.DNI;
    }

    /**
     * Permite a seleccionar un coordinador de una asignatura.
     *
     * @param a_coordinador La direccion del coordinador
     */
    function setCoordinador(address a_coordinador)
        public
        soloOwner
        soloAbierta
    {
        coordinador = a_coordinador;
    }

    /**
     * Cambiar el estado de la asignatura a cerrada
     *
     */
    function cerrar() public soloCoordinador {
        cerrada = true;
    }

    /**
     * Añadir un profesor a la asignatura
     *
     * @param a_profesor La direccion del profesor.
     * @param _nombre_profesor El nombre del profesor.
     */
    function addProfesor(address a_profesor, string memory _nombre_profesor)
        public
        soloOwner
        soloAbierta
    {
        bytes memory b_nombre_profesor = bytes(_nombre_profesor);
        require(
            b_nombre_profesor.length != 0,
            "El nombre del profesor no puede estar vacio"
        );

        // require(bytes(datos_profesor[msg.sender]).length == 0, "Profesor ya anadido a la asignatura");
        require(
            bytes(datosProfesor[a_profesor]).length == 0,
            "Profesor ya anadido a la asignatura"
        );
        //event Addressess(string msg, string out); // Logs

        //emit Addressess("Address", datosProfesor[address]);
        profesores.push(a_profesor);
        datosProfesor[a_profesor] = _nombre_profesor;
    }

    /**
     * Numero de profesores de la asignatura
     *
     */
    function profesoresLength() public view returns (uint256) {
        return profesores.length;
    }

    /**
     * Comprobar si el que envía esta transacción es profesor
     * Returns: Address del autor de la transacción y si es profesor (true)
     */
    function esProfesor() public view returns (address, bool) {
        return (msg.sender, bytes(datosProfesor[msg.sender]).length > 0);
    }



    /**
     * Poner la nota de un alumno en una evaluacion.
     *
     * @param alumno La direccion del alumno.
     * @param evaluacion El indice de una evaluacion en el array evaluaciones.
     * @param tipo Tipo de nota.
     * @param calificacion La calificacion, multipilicada por 100 porque no hay decimales.
     */
    function califica(
        address alumno,
        uint256 evaluacion,
        TipoNota tipo,
        uint256 calificacion
    ) public soloProfesor soloAbierta {
        require(
            estaMatriculado(alumno),
            "Solo se pueden calificar a un alumno matriculado."
        );
        require(
            evaluacion < evaluaciones.length,
            "No se puede calificar una evaluacion que no existe."
        );
        require(
            calificacion <= 100,
            "No se puede calificar con una nota superior a la maxima permitida."
        );
        Nota memory nota = Nota(tipo, calificacion);

        calificaciones[alumno][evaluacion] = nota;
    }

    /**
     * Consulta si una direccion pertenece a un alumno matriculado.
     *
     * @param alumno La direccion de un alumno.
     *
     * @return true si es una alumno matriculado.
     */
    function estaMatriculado(address alumno) private view returns (bool) {
        string memory _nombre = datosAlumno[alumno].nombre;

        bytes memory b = bytes(_nombre);

        return b.length != 0;
    }

    /**
     * Devuelve el tipo de nota y la calificacion que ha sacado el alumno que invoca el metodo en
    la evaluacion pasada como parametro.
     *
     * @param evaluacion Indice de una evaluacion en el array de evaluaciones.
     *
     * @return tipo El tipo de nota que ha sacado el alumno.
     * @return calificacion La calificacion que ha sacado el alumno.
     */
    function miNota(uint256 evaluacion)
        public
        view
        soloMatriculados
        returns (TipoNota tipo, uint256 calificacion)
    {
        require(
            evaluacion < evaluaciones.length,
            "El indice de la evaluacion no existe."
        );

        Nota memory nota = calificaciones[msg.sender][evaluacion];

        tipo = nota.tipo;
        calificacion = nota.calificacion;
    }

    /**
     * Modificador para que una funcion solo la pueda ejecutar el profesor.
     *
     * Se usa en creaEvaluacion y en califica.
     */
    modifier soloProfesor() {
        require(
            bytes(datosProfesor[msg.sender]).length > 0,
            "Solo permitido al profesor"
        );
        _;
    }

    /**
     * Modificador para que una funcion solo la pueda ejecutar un alumno matriculado.
     */
    modifier soloMatriculados() {
        require(
            estaMatriculado(msg.sender),
            "Solo permitido a alumnos matriculados"
        );
        _;
    }

    /**
     * Modificador para que una funcion solo la pueda ejecutar el owner.
     */
    modifier soloOwner() {
        require(
            owner == msg.sender,
            "Solo permitido para el owner del contrato"
        );
        _;
    }

    /**
     * Modificador para que una funcion solo la pueda ejecutar el coordinador.
     */
    modifier soloCoordinador() {
        require(
            coordinador == msg.sender,
            "Solo permitido para el coordinador de la asignatura"
        );
        _;
    }

    /**
     * Modificador para que una funcion solo la pueda ejecutar si la asignatura esta abierta.
     */
    modifier soloAbierta() {
        require(cerrada == false, "La asginatura ya ha sido cerrada");
        _;
    }
    /**
     * Modificador para que una funcion solo la pueda ejecutar un alumno no matriculado aun.
     */
    modifier noMatriculados() {
        require(
            !estaMatriculado(msg.sender),
            "Solo permitido a alumnos no matriculados"
        );
        _;
    }

    /**
     * No se permite la recepcion de dinero.
     */
    receive() external payable {
        revert("No se permite la recepcion de dinero.");
    }
}
