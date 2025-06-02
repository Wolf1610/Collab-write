import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <main className="h-screen flex justify-center items-center">
        <SignIn />
    </main>
  )
}

export default SignInPage;
