import { useState } from "react";
import { drizzleReactHooks } from "@drizzle/react-plugin";
import { newContextComponents } from "@drizzle/react-components";

import EvaluacionesHead from "./EvaluacionesHead";
import EvaluacionesBody from "./EvaluacionesBody";
import SoloCoordinador from "../Comprobaciones/SoloCoordinador";

const { ContractData } = newContextComponents;
const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const Evaluaciones = () => {
  const { drizzle } = useDrizzle();
  const drizzleState = useDrizzleState((state) => state);

  return (
    <section className="AppEvaluaciones">
      <h2>Evaluaciones</h2>

      <ContractData
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract={"Asignatura"}
        method={"evaluacionesLength"}
        render={(el) => (
          <table>
            <EvaluacionesHead />
            <EvaluacionesBody evaluacionesLength={el} />
          </table>
        )}
      />
      <EvaluacionesForm />
    </section>
  );
};

const EvaluacionesForm = () => {
  const { drizzle } = useDrizzle();
//   const drizzleState = useDrizzleState((state) => state);

  const [name, setName] = useState("");
  const [date, setDate] = useState(0);
  const [nota, setNota] = useState(0);
  return (
    <article>
      <h3>Añadir evaluación</h3>
      <SoloCoordinador>
        <form>
          <p>
            Nombre de la evaluación: &nbsp;
            <input
              key="name"
              type="test"
              name="_nombre"
              value={name}
              placeholder="Nombre de la evaluación"
              onChange={(ev) => setName(ev.target.value)}
            />
          </p>
          <p>
            Fecha de la evaluación: &nbsp;
            <input
              key="name"
              type="date"
              name="_fecha"
              //   value={name}
              placeholder="Fecha de la evaluación"
              onChange={(ev) => {
                setDate(new Date(ev.target.value).getTime()/1000);
              }}
            />
          </p>
          <p>
            Puntos (x10): &nbsp;
            <input
              key="name"
              type="test"
              name="_puntos"
              value={nota}
              placeholder="Puntos (x10)"
              onChange={(ev) => setNota(ev.target.value)}
            />
          </p>

          <button
            key="submit"
            type="button"
            onClick={(ev) => {
              ev.preventDefault();
              drizzle.contracts.Asignatura.methods.creaEvaluacion.cacheSend(
                name,
                date,
                nota*10
              );
            }}
          >
            Crear Evaluación
          </button>
        </form>
      </SoloCoordinador>
    </article>
  );
};

export default Evaluaciones;
