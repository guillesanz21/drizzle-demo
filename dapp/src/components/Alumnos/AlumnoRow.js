import {drizzleReactHooks} from '@drizzle/react-plugin'
import {newContextComponents} from "@drizzle/react-components";
import {Link, useParams} from "react-router-dom";

const {ContractData} = newContextComponents;
const {useDrizzle, useDrizzleState} = drizzleReactHooks;

const AlumnoRow = ({alumnoIndex, alumnoAddr}) => {
    const {drizzle} = useDrizzle();
    const drizzleState = useDrizzleState(state => state);

    return <tr key={"ALU-" + alumnoIndex}>
        <th>A<sub>{alumnoIndex}</sub></th>

        <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract={"Asignatura"}
            method={"datosAlumno"}
            methodArgs={[alumnoAddr]}
            render={datos => <>
                <td>{datos.nombre}</td>
                <td>{datos.email}</td>
                <td>{datos.DNI}</td>
            </>}
        />
        <td><Link to={`/alumnos/${alumnoAddr}`}>Info</Link></td>
    </tr>;
};

export default AlumnoRow;
