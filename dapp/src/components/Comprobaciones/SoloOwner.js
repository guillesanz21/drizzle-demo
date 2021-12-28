import { drizzleReactHooks } from "@drizzle/react-plugin";
import { newContextComponents } from "@drizzle/react-components";

const { ContractData, AccountData } = newContextComponents;
const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const SoloOwner = ({ children, owner }) => {
  const { drizzle } = useDrizzle();
  const drizzleState = useDrizzleState((state) => state);

  return (
    <ContractData
      drizzle={drizzle}
      drizzleState={drizzleState}
      contract={"Asignatura"}
      method={"owner"}
      render={(owner) => {
        return (
          <AccountData
            drizzle={drizzle}
            drizzleState={drizzleState}
            accountIndex={0}
            units="ether"
            precision={3}
            render={({ address, balance, units }) => {
              if (address === owner) {
                return <>{children}</>;
              } else {
                return (
                  <p>
                    <em>No soy el propietario del contrato</em>
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

export default SoloOwner;
