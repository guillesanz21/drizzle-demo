import {drizzleReactHooks} from '@drizzle/react-plugin'
import {newContextComponents} from "@drizzle/react-components";

import AlumnoMatriculado from '../Comprobaciones/AlumnoMatriculado';

const {ContractData} = newContextComponents;
const {useDrizzle, useDrizzleState} = drizzleReactHooks;

const MisNotas = () => {
    const {drizzle} = useDrizzle();
    const drizzleState = useDrizzleState(state => state);

    return (
      <section className="AppMisNotas">
        <h3>Mis Notas</h3>
        <AlumnoMatriculado>
          <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract={"Asignatura"}
            method={"evaluacionesLength"}
            render={(el) => (
              <table>
                <MisNotasHead evaluacionesLength={el} />
                <MisNotasBody evaluacionesLength={el} />
              </table>
            )}
          />
        </AlumnoMatriculado>
      </section>
    );
};

const MisNotasHead = () => {
    return <thead>
    <tr>
        <th>Evaluación</th>
        <th>Nota</th>
    </tr>
    </thead>;
};


const MisNotasBody = ({evaluacionesLength}) => {
    const {drizzle} = useDrizzle();
    const drizzleState = useDrizzleState(state => state);

    let rows = [];
    for (let ei = 0; ei < evaluacionesLength; ei++) {
        rows.push(
            <ContractData
                drizzle={drizzle}
                drizzleState={drizzleState}
                contract={"Asignatura"}
                method={"miNota"}
                methodArgs={[ei]}
                render={nota => <tr>
                    <td><ContractData key={"EVA-" + ei}
                                      drizzle={drizzle}
                                      drizzleState={drizzleState}
                                      contract={"Asignatura"}
                                      method={"evaluaciones"}
                                      methodArgs={[ei]}
                                      render={ev => ev.nombre}
                    /></td>
                    <td key={"miNotaIndex-" + ei}>
                        {nota?.tipo === "0" ? "N.P." : ""}
                        {nota?.tipo === "1" ? (nota.calificacion/10).toFixed(1) : ""}
                        {nota?.tipo === "2" ? (nota.calificacion/10).toFixed(1) + "(M.H.)" : ""}
                    </td>
                </tr>}
            />);
    }
    return <tbody>{rows}</tbody>;
};

export default MisNotas;
