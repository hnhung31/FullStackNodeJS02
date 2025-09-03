import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import { useContext, useEffect } from "react";
import { AuthContext } from "./components/context/auth.context";
import { Spin } from "antd";
import { getAccountApi } from "./utils/api";

function App() {
    const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);

    useEffect(() => {
        const fetchAccount = async () => {
            setAppLoading(true);
            const res = await getAccountApi();
            if (res && res.email) {
                setAuth({
                    isAuthenticated: true,
                    user: { email: res.email, name: res.name }
                });
            }
            setAppLoading(false);
        };
        fetchAccount();
    }, [setAuth, setAppLoading]);

    return (
        <div>
            {appLoading === true ?
                <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
                    <Spin />
                </div>
                :
                <>
                    <Header />
                    <Outlet />
                </>
            }
        </div>
    );
}

export default App;
