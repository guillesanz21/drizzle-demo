import { drizzleReactHooks } from "@drizzle/react-plugin";
import { newContextComponents } from "@drizzle/react-components";
import { useParams, Link } from "react-router-dom";

import AlumnosHead from "./AlumnosHead";
import AlumnosBody from "./AlumnosBody";
import AlumnoNoMatriculado from "../Comprobaciones/AlumnoNoMatriculado";

const { ContractData, AccountData, ContractForm } = newContextComponents;
const { useDrizzle, useDrizzleState } = drizzleReactHooks;

export const Alumnos = () => {
  const { drizzle } = useDrizzle();
  const drizzleState = useDrizzleState((state) => state);

  return (
    <section className="AppAlumnos">
      <h2>Alumnos</h2>

      <ContractData
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract={"Asignatura"}
        method={"matriculasLength"}
        render={(ml) => (
          <table>
            <AlumnosHead />
            <AlumnosBody matriculasLength={ml} />
          </table>
        )}
      />
      <Matricular />
    </section>
  );
};

const Matricular = () => {
  const { drizzle } = useDrizzle();
  const drizzleState = useDrizzleState((state) => state);

  return (
    <article>
      <h3>Matricularte</h3>
      <AlumnoNoMatriculado>
        <AccountData
          drizzle={drizzle}
          drizzleState={drizzleState}
          accountIndex={0}
          units="ether"
          precision={3}
          render={({ address, balance, units }) => {
            return (
              <>
                <p>
                  Su dirección de Metamask es: <em>{address}</em>
                </p>
                <ContractForm
                  drizzle={drizzle}
                  drizzleState={drizzleState}
                  contract="Asignatura"
                  method="automatricula"
                  //   labels={["Nombre", "Email", "DNI"]}
                  render={({
                    inputs,
                    inputTypes,
                    state,
                    handleInputChange,
                    handleSubmit,
                  }) => {
                    const labels = [
                      "Introduzca su nombre:",
                      "Introduzca su email:",
                      "Introduzca su DNI:",
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
                          Matricular
                        </button>
                      </form>
                    );
                  }}
                />
              </>
            );
          }}
        />
      </AlumnoNoMatriculado>
    </article>
  );
};

export const Alumno = () => {
  const { drizzle } = useDrizzle();
  const drizzleState = useDrizzleState((state) => state);

  let { addr } = useParams();

  return (
    <>
      <header className="AppAlumno">
        <h2>Alumno</h2>
      </header>

      <ul>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract={"Asignatura"}
          method={"datosAlumno"}
          methodArgs={[addr]}
          render={(datos) => (
            <>
              <li>
                <b>Nombre:</b> {datos?.nombre ?? "Desconocido"}
              </li>
              <li>
                <b>Email:</b> {datos?.email ?? "Desconocido"}
              </li>
              <li>
                <b>DNI:</b> {datos?.DNI ?? "Desconocido"}
              </li>
            </>
          )}
        />
        <li>
          <b>Address:</b> {addr}
        </li>
      </ul>

      <Link to="/alumnos">Volver</Link>
    </>
  );
};
