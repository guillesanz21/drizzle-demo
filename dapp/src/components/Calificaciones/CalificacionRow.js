import { useState } from "react";
import { drizzleReactHooks } from "@drizzle/react-plugin";
import { newContextComponents } from "@drizzle/react-components";

import SoloProfesor from "../Comprobaciones/SoloProfesor";

const { ContractData } = newContextComponents;
const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const CalificacionRow = ({ alumnoIndex, alumnoAddr, evaluacionesLength }) => {
  const { drizzle } = useDrizzle();
  const drizzleState = useDrizzleState((state) => state);

  let cells = [];
  for (let ei = 0; ei < evaluacionesLength; ei++) {
    cells.push(
      <ContractData
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract={"Asignatura"}
        method={"calificaciones"}
        methodArgs={[alumnoAddr, ei]}
        render={(nota) => (
          <td key={"p2-" + alumnoIndex + "-" + ei}>
            <NotaField nota={nota} alumnoAddr={alumnoAddr} evIndex={ei} />
          </td>
        )}
      />
    );
  }

  return (
    <tr key={"d" + alumnoIndex}>
      <th>
        A<sub>{alumnoIndex}</sub>
      </th>

      <td>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract={"Asignatura"}
          method={"datosAlumno"}
          methodArgs={[alumnoAddr]}
          render={(datos) => <>{datos.nombre}</>}
        />
      </td>

      {cells}
    </tr>
  );
};

const NotaField = ({ nota, alumnoAddr, evIndex }) => {
  let [editing, setEditing] = useState();
  let [newTipo, setNewTipo] = useState(nota.tipo);
  let [newNota, setNewNota] = useState(nota.calificacion);

  const { drizzle } = useDrizzle();

  let field = null;

  if (editing) {
    field = (
      <>
        <form>
          <p>
            Tipo: (0=NP 1=Nota 2=MH): &nbsp;
            <input
              key="tipo"
              type="text"
              name="tipo"
              value={newTipo}
              placeholder="Tipo de la nota"
              onChange={(ev) => setNewTipo(ev.target.value)}
            />
          </p>
          <p>
            Nota (x10): &nbsp;
            <input
              key="calificacion"
              type="text"
              name="calificacion"
              value={newNota}
              placeholder="Calificación"
              onChange={(ev) => setNewNota(ev.target.value)}
            />
          </p>
          <button
            key="submit"
            className="pure-button"
            type="button"
            onClick={(ev) => {
              ev.preventDefault();
              drizzle.contracts.Asignatura.methods.califica.cacheSend(
                alumnoAddr,
                evIndex,
                newTipo,
                newNota
              );
              setEditing(false);
            }}
          >
            Calificar
          </button>
          &emsp;
          <button
            key="cancel"
            className="pure-button"
            type="button"
            onClick={(ev) => {
              ev.preventDefault();
              setEditing(false);
            }}
          >
            Cancelar
          </button>
        </form>
      </>
    );
  } else {
    field = (
      <>
        {nota.tipo === "0" ? "N.P." : ""}
        {nota.tipo === "1" ? (nota.calificacion / 10).toFixed(1) : ""}
        {nota.tipo === "2" ? (nota.calificacion / 10).toFixed(1) + "(M.H.)" : ""}
        <SoloProfesor>
          &emsp;&emsp;
          <button type="button" onClick={() => setEditing(true)}>
            Editar
          </button>
        </SoloProfesor>
      </>
    );
  }

  return <>{field}</>;
};

export default CalificacionRow;
