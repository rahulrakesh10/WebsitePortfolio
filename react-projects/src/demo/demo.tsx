import Hero from "@/components/ui/animated-shader-hero";

export const DemoOne = () => {
    const handlePrimaryClick = () => {
        // eslint-disable-next-line no-console
        console.log("Get Started clicked!");
    };

    const handleSecondaryClick = () => {
        // eslint-disable-next-line no-console
        console.log("Explore Features clicked!");
    };

    return (
        <div className="w-full min-h-screen dark bg-background text-foreground">
            <Hero
                trustBadge={{
                    text: "Trusted by forward-thinking teams.",
                    icons: ["✨"],
                }}
                headline={{
                    line1: "Launch Your",
                    line2: "Workflow Into Orbit",
                }}
                subtitle="Supercharge productivity with AI-powered automation and integrations built for the next generation of teams — fast, seamless, and limitless."
                buttons={{
                    primary: {
                        text: "Get Started for Free",
                        onClick: handlePrimaryClick,
                    },
                    secondary: {
                        text: "Explore Features",
                        onClick: handleSecondaryClick,
                    },
                }}
            />
        </div>
    );
};
