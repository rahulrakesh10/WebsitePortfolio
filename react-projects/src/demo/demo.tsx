import AnoAI from "@/components/ui/animated-shader-background";

export const DemoOne = () => {
    return (
        // Changed to bg-white so the black shader effect is visible
        <div className="w-full h-screen bg-white">
            <AnoAI />
        </div>
    );
};
