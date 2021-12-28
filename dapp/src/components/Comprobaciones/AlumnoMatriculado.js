import { drizzleReactHooks } from "@drizzle/react-plugin";
import { newContextComponents } from "@drizzle/react-components";

const { ContractData, AccountData } = newContextComponents;
const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const AlumnoNoMatriculado = ({ children }) => {
  const { drizzle } = useDrizzle();
  const drizzleState = useDrizzleState((state) => state);

  return (
    <AccountData
      drizzle={drizzle}
      drizzleState={drizzleState}
      accountIndex={0}
      units="ether"
      precision={3}
      render={({ address, balance, units }) => {
        return (
          <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract={"Asignatura"}
            method={"estaMatriculado"}
            methodArgs={[address]}
            render={(estaMatriculado) => {
              if (estaMatriculado) {
                return <>{children}</>;
              } else {
                return (
                  <p>
                    <em>No está matriculado como alumno</em>
                  </p>
                );
              }
            }}
          />
        );
      }}
    />
  );
};

export default AlumnoNoMatriculado;
