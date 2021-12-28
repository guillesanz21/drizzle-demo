import { useState } from "react";

import { drizzleReactHooks } from "@drizzle/react-plugin";
import { newContextComponents } from "@drizzle/react-components";

import SoloProfesor from "../Comprobaciones/SoloProfesor";

const { ContractForm } = newContextComponents;
const { useDrizzle, useDrizzleState } = drizzleReactHooks;


export const CalificarV0 = () => {
  const { drizzle } = useDrizzle();
  const drizzleState = useDrizzleState((state) => state);

  let [alumnoAddr, setAlumnoAddr] = useState("");
  let [indexEval, setEvalIndex] = useState("");
  let [tipo, setTipo] = useState("");
  let [calificacion, setCalificacion] = useState("");

  return (
    <article className="AppMisDatos">
      <h3>Calificar V0</h3>
      <SoloProfesor>
        <form>
          <p>
            Dirección del Alumno: &nbsp;
            <input
              key="alumno"
              type="text"
              name="alumno"
              value={alumnoAddr}
              placeholder="Dirección del alumno"
              onChange={(ev) => setAlumnoAddr(ev.target.value)}
            />
          </p>
          <p>
            Índice de la Evaluación: &nbsp;
            <input
              key="evaluacion"
              type="number"
              name="evaluacion"
              value={indexEval}
              placeholder="Índice de la evaluación"
              onChange={(ev) => setEvalIndex(ev.target.value)}
            />
          </p>
          <p>
            Tipo: (0=NP 1=Nota 2=MH): &nbsp;
            <input
              key="tipo"
              type="number"
              name="tipo"
              value={tipo}
              placeholder="Tipo de nota"
              onChange={(ev) => setTipo(ev.target.value)}
            />
          </p>
          <p>
            Nota (x10): &nbsp;
            <input
              key="calificacion"
              type="number"
              name="calificacion"
              value={calificacion}
              placeholder="Nota"
              onChange={(ev) => setCalificacion(ev.target.value)}
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
                indexEval,
                tipo,
                calificacion
              );
            }}
          >
            Calificar
          </button>
        </form>
      </SoloProfesor>
    </article>
  );
};

export const CalificarV1 = () => {
  const { drizzle } = useDrizzle();
  const drizzleState = useDrizzleState((state) => state);
  return (
    <article className="AppMisDatos">
      <h3>Calificar V1</h3>
      <SoloProfesor>
        <ContractForm
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="Asignatura"
          method="califica"
          render={({
            inputs,
            inputTypes,
            state,
            handleInputChange,
            handleSubmit,
          }) => {
            const labels = [
              "Dirección del Alumno:",
              "Índice de la Evaluación:",
              "Tipo: (0=NP 1=Nota 2=MH):",
              "Nota (x10)",
            ];
            return (
              <form onSubmit={handleSubmit}>
                {inputs.map((input, index) => (
                  <p>
                    {" "}
                    {labels[index]} &nbsp;
                    <input
                      key={input.name}
                      type={inputTypes[index]}
                      name={input.name}
                      value={state[input.name]}
                      placeholder={input.name}
                      onChange={handleInputChange}
                    />
                  </p>
                ))}
                <button key="submit" type="button" onClick={handleSubmit}>
                  calificar
                </button>
              </form>
            );
          }}
        />
      </SoloProfesor>
    </article>
  );
};

export const CalificarV2 = () => {
  const { drizzle } = useDrizzle();
  const drizzleState = useDrizzleState((state) => state);

  return (
    <article className="AppMisDatos">
      <h3>Calificar V2</h3>
      <SoloProfesor>
        <ContractForm
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="Asignatura"
          method="califica"
        />
      </SoloProfesor>
    </article>
  );
};

export const CalificarV3 = () => {
  const { drizzle } = useDrizzle();
  const drizzleState = useDrizzleState((state) => state);

  return (
    <article className="AppMisDatos">
      <h3>Calificar V3</h3>
      <SoloProfesor>
        <ContractForm
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="Asignatura"
          method="califica"
          labels={[
            "Dirección Alumno",
            "Índice Evaluación",
            "0=NP 1=Nota 2=MH",
            "Nota (x10)",
          ]}
        />
      </SoloProfesor>
    </article>
  );
};
