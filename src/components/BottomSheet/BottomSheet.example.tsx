import { BottomSheet } from "./BottomSheet";
import { useBottomSheetStore } from "@/stores/bottomSheetStore";

export const BottomSheetExample = () => {
    const { setBottomSheet } = useBottomSheetStore();

    const examples = [
        { height: "50%", label: "50% Height" },
        { height: "380px", label: "380px Height" },
        { height: "75vh", label: "75vh Height" },
    ];

    return (
        <div className="space-y-4 p-4">
            {examples.map(({ height, label }) => (
                <button
                    key={height}
                    onClick={() => setBottomSheet(true, "example", height)}
                    className="block w-full px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Show Bottom Sheet ({label})
                </button>
            ))}

            {/* The BottomSheet component should be rendered at the app root level */}
            <BottomSheet />
        </div>
    );
};
