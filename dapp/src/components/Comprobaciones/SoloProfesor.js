import { drizzleReactHooks } from "@drizzle/react-plugin";
import { newContextComponents } from "@drizzle/react-components";

const { ContractData } = newContextComponents;
const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const SoloProfesor = ({ children }) => {
  const { drizzle } = useDrizzle();
  const drizzleState = useDrizzleState((state) => state);

  return (
    <ContractData
      drizzle={drizzle}
      drizzleState={drizzleState}
      contract={"Asignatura"}
      method={"esProfesor"}
      render={(result) => {
        //   let addr = result[0];
        let esProfesor = result[1];
        if (!esProfesor) {
          return (
            <p>
              <em>No soy el profesor</em>
            </p>
          );
        }
        return <>{children}</>;
      }}
    />
  );
};

export default SoloProfesor;
