import LoginButton from "./login-button";

const LoginPage = async () => {
  return (
    <section className="w-full h-full">
      <div className="flex flex-col lg:flex-row items-center lg:items-start text-start text-foreground gap-10 lg:gap-0 h-full justify-start">
        <div className="lg:max-w-none flex flex-col md:justify-center w-full lg:w-[50%] border-border p-6 h-full mr-auto lg:border-r-2 lg:border-solid section-px lg:px-[60px] py-10 bg-muted/20">
          <div className="flex flex-col gap-8 items-start max-w-[500px] md:my-auto mx-auto w-full justify-center p-10 rounded-md border-border border-solid border-2 bg-background z-1">
            <h1 className="text-h3">Login form</h1>
            <LoginButton />
          </div>
        </div>
        <div className="bg-foreground hidden lg:flex h-full w-[50%] items-start justify-start overflow-hidden"></div>
      </div>
    </section>
  );
};

export default LoginPage;
