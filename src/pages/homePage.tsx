import { NavLink } from "react-router-dom";
import { ArrowRightIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Logo } from "@/components/logo";

import CustomGlobe from "@/components/globe/custom-globe";

const HomePage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-[50] w-full border-b border-border/40 bg-background/95 backdrop-blur-sm dark:bg-black/[0.6]">
        <div className="container flex h-14 items-center">
          <NavLink
            to="/"
            className="flex items-center justify-start transition-opacity duration-300 hover:opacity-85"
          >
            <Logo />
            <span className="ml-1 font-bold">NorthFund</span>
            <span className="sr-only ml-1">NorthFund</span>
          </NavLink>
          <nav className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-background"
              asChild
            >
              <NavLink to="">
                <GitHubLogoIcon className="h-[1.2rem] w-[1.2rem]" />
              </NavLink>
            </Button>
            <ModeToggle />
          </nav>
        </div>
      </header>
      <main className="min-h-[calc(100vh-57px-97px)] flex-1">
        <div className="container relative pb-1">
          <section className="mx-auto  flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-4 md:pb-4 lg:py-8 lg:pb-2">
            <h1 className="text-center text-3xl font-bold lg:mb-5 leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
              Support Students with NorthFund
            </h1>
            <span className="max-w-[750px] text-center text-lg font-light text-foreground">
              Empowering students with financial needs through decentralized
              crowdfunding on the Solana blockchain. NorthFund connects students
              with supporters worldwide, providing secure, transparent, and fast
              funding solutions to help them achieve their educational goals.
            </span>
            <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-6">
              <Button variant="default" asChild>
                <NavLink to="/dashboard/campaigns/new">
                  Dashboard
                  <ArrowRightIcon className="ml-2" />
                </NavLink>
              </Button>
              <Button variant="outline" asChild>
                <NavLink to="/campaigns">See All Campaigns</NavLink>
              </Button>
            </div>
          </section>
          <div className="relative flex w-full justify-center">
            <CustomGlobe />,
          </div>
        </div>
      </main>
      <footer className="border-t border-border/40 py-6 md:py-0">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
            Built by{" "}
            <NavLink
              to="https://github.com/emekamanuel"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Manuel Of The North
            </NavLink>
            . The source code is available on{" "}
            <NavLink
              to="https://github.com/emekamanuel"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </NavLink>
            .
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
