import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="flex h-screen">
      <aside className="flex flex-1 flex-col gap-24">
        <Link to={"/"} className="flex mt-7 ml-8 items-center">
          {/* <img className="w-10" src="/logo_no_bg.png" alt="Logo du site" /> */}
          {/* <h1 className="text-2xl font-bold font-sans">FairBank</h1> */}
          <h1 className="text-6xl font-jomhuria">FairBank</h1>
        </Link>
        <div className="w-full px-10">
          <img src="/login.svg" alt="Sign in image" />
        </div>
      </aside>
      {/* <section className="flex flex-1 justify-center w-80 bg-green-50"> */}
      <section className="flex flex-1 justify-center w-80 bg-white">
        <div className="absolute top-0 right-0 m-5">
          <Link to={"/connexion"}>
            <Button variant={"ghost"}>Se connecter</Button>
          </Link>
        </div>
        {/* <Card className="w-96 h-[25rem] mt-52"> */}
        <Card className="w-96 h-[25rem] mt-52 border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl text-center">S'incrire</CardTitle>
            <CardDescription className="text-center">
              Entrer votre email ci-dessous pour créer votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* <form onSubmit={handleFormSubmit()}> */}
            <form>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="name">Nom</Label>
                  <Input type="text" id="name" placeholder="Nom" required />
                  <Label htmlFor="email">Courriel</Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="nom@exemple.com"
                    required
                  />
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    type="password"
                    id="password"
                    placeholder="•••••••••"
                    required
                  />
                  <Label htmlFor="password">Confirmer le mot de passe</Label>
                  <Input
                    type="password"
                    id="repassword"
                    placeholder="•••••••••"
                    required
                  />
                  <Button type="button" className="mt-2">
                    Se connecter avec l'email
                  </Button>
                </div>
                {/* <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Ou continuer avec
                    </span>
                  </div>
                </div>
                <Button variant={"outline"} type="button">
                  <FaGoogle className="mr-2 h-4 w-4" />
                  Google
                </Button> */}
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </section>
  );
}
