import {drizzleReactHooks} from '@drizzle/react-plugin'
import {newContextComponents} from "@drizzle/react-components";

const {AccountData, ContractData} = newContextComponents;
const {useDrizzle, useDrizzleState} = drizzleReactHooks;

const MisDatos = () => {
    const {drizzle} = useDrizzle();
    const drizzleState = useDrizzleState(state => state);

    return (
        <article className="AppMisDatos">
            <h3>Mis Datos</h3>
            <ul>
                <ContractData
                    drizzle={drizzle}
                    drizzleState={drizzleState}
                    contract={"Asignatura"}
                    method={"quienSoy"}
                    methodArgs={[]}
                    render={datos => <>
                        <li>Nombre: <span style={{color: "blue"}}>{datos?._nombre || "No matriculado"}</span></li>
                        <li>Email: <span style={{color: "blue"}}>{datos?._email || "No matriculado"}</span></li>
                    </>}
                />
                <AccountData
                    drizzle={drizzle}
                    drizzleState={drizzleState}
                    accountIndex={0}
                    units="ether"
                    precision={3}
                    render={({address, balance, units}) => <>
                        <li>Dirección: <span style={{color: "blue"}}>{address}</span></li>
                        <li>Balance: <span style={{color: "blue"}}>{balance}</span> {units}</li>
                    </>}
                />
            </ul>
        </article>);
};

export default MisDatos;
