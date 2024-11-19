import { ThemeProvider } from "./providers/theme-provider";
import { AuthContext, WalletContextProvider } from "./components/wallets";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.min.css";

const AppLayout = ({ children }) => {
  return (
    <>
      <ThemeProvider defaultTheme="system">
        <ToastContainer pauseOnHover theme="colored" />
        <WalletContextProvider>
          <AuthContext>{children}</AuthContext>
        </WalletContextProvider>
      </ThemeProvider>
    </>
  );
};

export default AppLayout;
