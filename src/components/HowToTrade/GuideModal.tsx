import React from "react";
import { Modal } from "@/components/ui/modal";
import { guideConfig } from "@/config/guideConfig";
import { TabList } from "../ui/tab-list";

interface GuideProps {
  isOpen: boolean;
  onClose: () => void;
  type?: string;
}

const Guides = [
  { label: "Rise/Fall", value: "rise-fall" },
];

export const GuideModal = ({ isOpen, onClose, type = "rise-fall" }: GuideProps) => {
  const content = guideConfig[type]?.body;

  if (!content) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Trade types">
      <TabList
        variant={"chip"}
        tabs={Guides}
        selectedValue={"rise-fall"}
        onSelect={(value) => value}
      />
      {content}
    </Modal>
  );
};
