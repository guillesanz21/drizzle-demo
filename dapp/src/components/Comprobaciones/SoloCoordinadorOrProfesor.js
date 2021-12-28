import { drizzleReactHooks } from "@drizzle/react-plugin";
import { newContextComponents } from "@drizzle/react-components";

const { ContractData, AccountData } = newContextComponents;
const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const SoloProfesor = ({ children }) => {
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
              return (
                <ContractData
                  drizzle={drizzle}
                  drizzleState={drizzleState}
                  contract={"Asignatura"}
                  method={"esProfesor"}
                  render={(result) => {
                    let esProfesor = result[1];
                    console.log("Es coordinador: ");
                    console.log(address === coordinador);
                    console.log("Es profesor: ");
                    console.log(esProfesor);
                    if (address === coordinador || esProfesor) {
                      return <>{children}</>;
                    } else {
                      return <p>
                        <em>No estas autorizado para ver esto</em>
                      </p>;
                    }
                  }}
                />
              );
            }}
          />
        );
      }}
    />
  );
};

export default SoloProfesor;
