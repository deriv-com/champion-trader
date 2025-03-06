import { useTradeStore } from "@/stores/tradeStore";
import { DesktopTradeFieldCard } from "@/components/ui/desktop-trade-field-card";
import ToggleButton from "@/components/TradeFields/ToggleButton";

export const EqualTradeController = () => {
    const { allowEquals, toggleAllowEquals } = useTradeStore();

    return (
        <DesktopTradeFieldCard>
            <ToggleButton label="Allow equals" value={allowEquals} onChange={toggleAllowEquals} />
        </DesktopTradeFieldCard>
    );
};
