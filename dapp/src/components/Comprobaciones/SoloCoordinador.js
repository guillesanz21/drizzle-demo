import { drizzleReactHooks } from "@drizzle/react-plugin";
import { newContextComponents } from "@drizzle/react-components";

const { ContractData, AccountData } = newContextComponents;
const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const SoloCoordinador = ({ children, coordinador }) => {
  const { drizzle } = useDrizzle();
  const drizzleState = useDrizzleState((state) => state);

  return (
    <ContractData
      drizzle={drizzle}
      drizzleState={drizzleState}
      contract={"Asignatura"}
      method={"coordinador"}
      render={(coordinador) => {
        return (
          <AccountData
            drizzle={drizzle}
            drizzleState={drizzleState}
            accountIndex={0}
            units="ether"
            precision={3}
            render={({ address, balance, units }) => {
              if (address === coordinador) {
                return <>{children}</>;
              } else {
                return (
                  <p>
                    <em>No soy el coordinador</em>
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

export default SoloCoordinador;