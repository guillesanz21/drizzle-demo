import { drizzleReactHooks } from "@drizzle/react-plugin";
import { newContextComponents } from "@drizzle/react-components";

const { ContractData, ContractForm, AccountData } = newContextComponents;
const { useDrizzle, useDrizzleState } = drizzleReactHooks;


// ################ MAIN COMPONENT ################
function Home() {
  const { drizzle } = useDrizzle();
  const drizzleState = useDrizzleState((state) => state);

  return (
    <ContractData
      drizzle={drizzle}
      drizzleState={drizzleState}
      contract={"Asignatura"}
      method={"owner"}
      render={(owner) => (
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract={"Asignatura"}
          method={"coordinador"}
          render={(coordinador) => {
            return (
              <>
                <h2>Página Home de la Asignatura</h2>
                <Direcciones owner={owner} coordinador={coordinador} />
                <EstadoAsignatura coordinador={coordinador} />
              </>
            );
          }}
        />
      )}
    />
  );
}

// ################ DIRECCIONES ################
const Direcciones = ({ owner, coordinador }) => {
  return (
    <section>
      <h3>Direcciones</h3>
      <p>Dirección del owner: </p>
      <p>
        <em>&emsp;&emsp;&emsp;{owner}</em>
      </p>
      <p>Dirección del coordinador de la asignatura: </p>
      <p>
        <em>&emsp;&emsp;&emsp;{coordinador}</em>
      </p>
      <FormDireccion owner={owner} />
    </section>
  );
};

const FormDireccion = ({ owner }) => {
  const { drizzle } = useDrizzle();
  const drizzleState = useDrizzleState((state) => state);
  return (
    <article>
      <h4>Cambiar el coordinador de la asignatura</h4>
      <SoloOwner owner={owner}>
        <ContractForm
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="Asignatura"
          method="setCoordinador"
          labels={["Dirección del nuevo coordinador"]}
        />
      </SoloOwner>
    </article>
  );
};


// ################ ESTADO ASIGNATURA ################
const EstadoAsignatura = ({ coordinador }) => {
  const { drizzle } = useDrizzle();
  const drizzleState = useDrizzleState((state) => state);
  return (
    <section>
      <h3>Estado de la asignatura</h3>
      <ContractData
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract={"Asignatura"}
        method={"cerrada"}
        render={(cerrada) => {
          let estado = cerrada ? "cerrada" : "abierta";
          return (
            <p>
              La asignatura está: <b>{estado}</b>
            </p>
          );
        }}
      />
      <FormEstadoAsignatura coordinador={coordinador} />
    </section>
  );
};

const FormEstadoAsignatura = ({ coordinador }) => {
  const { drizzle } = useDrizzle();
  const drizzleState = useDrizzleState((state) => state);
  return (
    <article>
      <h4>Cerrar la asignatura</h4>
      <SoloCoordinador coordinador={coordinador}>
        <ContractForm
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="Asignatura"
          method="cerrar"
          labels={["Cerrar asignatura"]}
        />
      </SoloCoordinador>
    </article>
  );
};

// ################ CHECK COORDINADOR AND CHECK OWNER ################
const SoloCoordinador = ({ children, coordinador }) => {
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
        if (address === coordinador) {
          return <>{children}</>;
        } else {
          return (
            <p>
              <em>No eres coordinador</em>
            </p>
          );
        }
      }}
    />
  );
};

const SoloOwner = ({ children, owner }) => {
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
        if (owner) {
          return <>{children}</>;
        } else {
          return (
            <p>
              <em>No eres el propietario del contrato</em>
            </p>
          );
        }
      }}
    />
  );
};

export default Home;
