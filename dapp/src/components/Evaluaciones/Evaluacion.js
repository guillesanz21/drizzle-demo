import { drizzleReactHooks } from "@drizzle/react-plugin";
import { newContextComponents } from "@drizzle/react-components";
import { useParams } from "react-router-dom";

import SoloCoordinadorOrProfesor from '../Comprobaciones/SoloCoordinadorOrProfesor';

const { ContractData } = newContextComponents;
const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const Evaluacion = () => {
  const { drizzle } = useDrizzle();
  const drizzleState = useDrizzleState((state) => state);

  let { ev } = useParams();

  return (
    <section>
      <h2>
        Notas de la evaluación: E<sub>{ev}</sub>
      </h2>
      <SoloCoordinadorOrProfesor>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract={"Asignatura"}
          method={"matriculasLength"}
          render={(matriculasLength) => {
            return <AlumnosNotas alumnosLength={matriculasLength} ev={ev} />;
          }}
        />
      </SoloCoordinadorOrProfesor>
    </section>
  );
};

const AlumnosNotas = ({ alumnosLength, ev }) => {
  let rows = [];
  for (let i = 0; i < alumnosLength; i++) {
    rows.push(<AlumnoNotas alumnoIndex={i} ev={ev} />);
  }
  return <ul>{rows}</ul>;
};

const AlumnoNotas = ({ alumnoIndex, ev }) => {
  const { drizzle } = useDrizzle();
  const drizzleState = useDrizzleState((state) => state);

  return (
    <ContractData
      drizzle={drizzle}
      drizzleState={drizzleState}
      contract={"Asignatura"}
      method={"matriculas"}
      methodArgs={[alumnoIndex]}
      render={(alumno) => {
        return (
          <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract={"Asignatura"}
            method={"calificaciones"}
            methodArgs={[alumno, ev]}
            render={({ tipo, calificacion }) => {
              return (
                <li>
                  Alumno: <em>{alumno}</em>:
                  <ul>
                    <li>
                      Nota (sobre 100): <b>{calificacion}</b>
                    </li>
                  </ul>
                </li>
              );
            }}
          />
        );
      }}
    />
  );
};

export default Evaluacion;
