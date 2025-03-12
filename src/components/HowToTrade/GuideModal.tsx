import { Modal } from "@/components/ui/modal";
import { guideConfig } from "@/config/guideConfig";
import { TabList } from "../ui/tab-list";
import { TradeType } from "@/config/tradeTypes";

interface GuideProps {
    isOpen: boolean;
    onClose: () => void;
    type?: TradeType;
}

const Guides = [{ label: "Rise/Fall", value: "rise_fall" }];

export const GuideModal = ({ isOpen, onClose, type = "rise_fall" }: GuideProps) => {
    const content = guideConfig[type]?.body;

    if (!content) {
        return null;
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Trade types"
            headerContent={
                <TabList
                    variant={"chip"}
                    tabs={Guides}
                    selectedValue={"rise_fall"}
                    onSelect={(value) => value}
                />
            }
            actionButton={{
                show: true,
                label: "Got it",
                onClick: onClose,
            }}
        >
            {content}
        </Modal>
    );
};
