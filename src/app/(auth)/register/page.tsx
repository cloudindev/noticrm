import Link from "next/link";
import { RegisterForm } from "@/features/auth/components/form-register";

export default function RegisterPage() {
  return (
    <div className="flex w-full flex-col justify-center space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Crea tu cuenta
        </h1>
        <p className="text-sm text-muted-foreground">
          Introduce tus datos a continuación para comenzar
        </p>
      </div>

      <div className="grid gap-6">
        <RegisterForm />
      </div>

      <p className="px-8 text-center text-sm text-muted-foreground mt-4">
        Al hacer clic en continuar, aceptas nuestros{" "}
        <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
          Términos de servicio
        </Link>{" "}
        y{" "}
        <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
          Política de Privacidad
        </Link>
        .
      </p>
      
      <p className="px-8 text-center text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}
