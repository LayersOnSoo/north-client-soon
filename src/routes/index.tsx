import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "./routes";
import AppLayout from "@/AppLayout";
import { useState, useEffect, startTransition, Suspense } from "react";
import { LoadingSpinner } from "@/components/loader";

const router = createBrowserRouter(routes);

const AppRouter = () => {
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setIsPending(true);
      setIsPending(false);
    });
  }, []);
  return (
    <AppLayout>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner />
          </div>
        }
      >
        {isPending ? (
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner />
          </div>
        ) : (
          <RouterProvider router={router} />
        )}
      </Suspense>
    </AppLayout>
  );
};

export default AppRouter;
